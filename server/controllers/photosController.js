const path = require("path");
const fs = require("fs/promises");
const { UPLOAD_DIR_NAME, UPLOAD_DIR_ABS } = require("../middlewares/uploads");
const photoSchema = require("../models/photo");
const exifr = require("exifr");
const { mkThumbnail } = require("../utils/image");
// 单张图片上传
const uploadSingle = async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: "未接收到文件" });
  }
  try {
    const { file } = req;
    const album = req.query.album?.trim();
    // 生成缩略图
    const exif = await exifr.parse(file.path, {
      gps: true,
      tiff: true,
      ifd0: true,
      exif: true,
    });
    const url = album
      ? `/${UPLOAD_DIR_NAME}/${album}/${file.filename}`
      : `/${UPLOAD_DIR_NAME}/${file.filename}`;
    const absInput = file.path;
    const absOutputDir = album
      ? path.join(UPLOAD_DIR_ABS, album)
      : UPLOAD_DIR_ABS;
    const { thumbnailName } = await mkThumbnail(
      absInput,
      absOutputDir,
      file.filename
    );
    const relDir = album
      ? `/${UPLOAD_DIR_NAME}/${album}`
      : `/${UPLOAD_DIR_NAME}`;
    const thumbRel = `${relDir}/${thumbnailName}`;
    const photo = new photoSchema({
      filename: file.filename,
      size: file.size,
      album: file.album || "",
      originalName: file.originalname,
      tags: file.tags || [],
      mimetype: file.mimetype,
      album: album,
      path: url,
      thumbnailPath: thumbRel,
      camera: {
        make: exif.Make || "未知",
        model: exif.Model || "未知",
        iso: exif.ISO || "未知",
        focalLength: exif.FocalLength || null,
        shutterSpeed: exif?.ExposureTime || null,
      },
      updateAt: Date.now(),
    });
    const saved = await photo.save();
    res.status(200).json({
      saved,
    });
  } catch (err) {
    return res.status(500).json({ err });
  }
};
// 多张图片上传
const uploadMultiple = async (req, res) => {
  if (!req.files) {
    return res.status(400).json({ error: "文件为空，请重新检查" });
  }
  try {
    const files = req.files.map(async (file) => {
      const exif = await exifr.parse(file.path, {
        gps: true,
        tiff: true,
        ifd0: true,
        exif: true,
      });
      const album = req.query.album?.trim();
      const tags = req.body.tags;
      const absInput = file.path;
      const absOutputDir = album
        ? path.join(UPLOAD_DIR_ABS, album)
        : UPLOAD_DIR_ABS;
      const { thumbnailName } = await mkThumbnail(
        absInput,
        absOutputDir,
        file.filename
      );
      const relDir = album
        ? `/${UPLOAD_DIR_NAME}/${album}`
        : `/${UPLOAD_DIR_NAME}`;
      const thumbRel = `${relDir}/${thumbnailName}`;
      const url = album
        ? `/${UPLOAD_DIR_NAME}/${album}/${file.filename}`
        : `${UPLOAD_DIR_NAME}/${file.filename}`;
      const photo = new photoSchema({
        filename: file.filename,
        size: file.size,
        originalName: file.originalname,
        tags,
        mimetype: file.mimetype,
        thumbnailPath: thumbRel,
        album: album || "",
        path: url,
        camera: {
          make: exif.Make || "未知",
          model: exif.Model || "未知",
          iso: exif.ISO || "未知",
          focalLength: exif.FocalLength || null,
          shutterSpeed: exif?.ExposureTime || null,
        },
        updateAt: Date.now(),
      });
      return await photo.save();
    });
    res.status(200).json({ message: "所有文件上传成功" });
  } catch (err) {
    return res.status(500).json({ err });
  }
};
// 单张图片删除
const deleteSingle = async (req, res) => {
  const photoId = await req.params.id;
  if (!photoId) {
    return res.status(100).json({ message: "未查询到id" });
  }
  try {
    const photo = await photoSchema.findById(photoId);
    if (!photo) {
      return res.status(404).json({ message: "图片未找到" });
    }
    const filepath = path.join(__dirname, "..", photo.path);
    try {
      await fs.unlink(filepath);
    } catch (err) {
      console.warn("文件删除失败（可能已不存在）：", err.message);
    }
    await photoSchema.findByIdAndDelete(photoId);
    return res.status(201).json({ message: "图片删除成功" });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ error: err, message: "服务器错误" });
  }
};
// 多张图片删除
const deleteMultiple = async (req, res) => {
  const { photoId } = req.body;
  if (!photoId) {
    return res.status(300).json({ message: "未获取到id!" });
  }
  try {
    photoId.map(async (id) => {
      const photo = await photoSchema.findById(id);
      // const filepath = path.resolve(process.cwd(), photo.path);
      const filepath = path.join(__dirname, "..", photo.path);
      try {
        await fs.unlink(filepath);
      } catch (err) {
        console.warn("文件删除失败（可能已不存在）：", err.message);
      }
      await photoSchema.findOneAndDelete(id);
    });
    return res.status(201).json({ message: "图片删除成功" });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ error: err, message: "服务器错误" });
  }
};
// 获取全部照片
const getImages = async (req, res) => {
  try {
    const album = req.query.album?.trim();
    const filter = album ? { album } : {};
    const photos = await photoSchema.find(filter).sort({ updateAt: -1 });
    const fullPhotos = photos.map((photo) => {
      return {
        ...photo.toObject(),
        thumbnailUrl: `${process.env.BASE_URL}${
          photo.thumbnailPath
        }`,
        url: `${process.env.BASE_URL}${photo.path}`,
      };
    });
    res.status(200).json({
      message: "获取照片成功",
      data: fullPhotos,
    });
  } catch (err) {
    res.status(500).json({ error: err, message: "服务器错误" });
  }
};
// 根据相册获取照片
const getImagesByAlbum = async (req, res) => {
  if (!req.query) {
    return res.status(400).json({ error: "未获取到相册名" });
  }
  try {
    const album = req.query.album;
    const filter = { album };
    const photos = (await photoSchema.find(filter).sort({ updateAt: -1 })).map(
      (photo) => {
        return {
          id: photo._id,
          thumbnailUrl: `${req.protocol}://${req.get("host")}${
            photo.thumbnailPath
          }`,
          url: `${req.protocol}://${req.get("host")}${photo.path}`,
          ...photo.toObject(),
        };
      }
    );
    return res.status(201).json({ message: "获取成功", photos, album: album });
  } catch (err) {
    console.log(err);
    return res.status(500).json(err);
  }
};
module.exports = {
  getImagesByAlbum,
  uploadMultiple,
  uploadSingle,
  deleteSingle,
  deleteMultiple,
  getImages,
};
