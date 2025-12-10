const path = require("path");
const fs = require("fs/promises");
const { UPLOAD_DIR_NAME, UPLOAD_DIR_ABS } = require("../middlewares/uploads");
const photoSchema = require("../models/photo");
const exifr = require("exifr");
const { mkThumbnail } = require("../utils/image");
const {
  successResponse,
  errorResponse,
} = require("../middlewares/responseHandler");
const {
  PARAM_MISSING,
  SERVER_ERROR,
  DB_ERROR,
} = require("../utils/errorTypes");
// 单张图片上传
const uploadSingle = async (req, res) => {
  if (!req.file) {
    return errorResponse(res, PARAM_MISSING, "未接收到文件", 400);
  }
  try {
    const { file } = req;
    const album = req.query.album?.trim();
    // 获取exif信息
    let exif = {};
    exif = await exifr.parse(file.path, {
      gps: true,
      tiff: true,
      ifd0: true,
      exif: true,
    });
    if (!exif) {
      exif = await exifr.parse(file.path);
    }
    // 图片浏览路径
    const url = album
      ? `/${UPLOAD_DIR_NAME}/${album}/${file.filename}`
      : `/${UPLOAD_DIR_NAME}/${file.filename}`;
    // 创建图片存储路径
    const relDir = album
      ? `/${UPLOAD_DIR_NAME}/${album}`
      : `/${UPLOAD_DIR_NAME}`;
    // 创建缩略图路径
    const absInput = file.path;
    const absOutputDir = album
      ? path.join(UPLOAD_DIR_ABS, album)
      : UPLOAD_DIR_ABS;
    // 创建较大缩略图
    const { thumbnailName: bigThumbName } = await mkThumbnail(
      absInput,
      absOutputDir,
      file.filename,
      1200
    );
    const bigThumbRel = `${relDir}/${bigThumbName}`;
    // 创建最小缩略图
    const { thumbnailName: smallThumbName } = await mkThumbnail(
      path.join(UPLOAD_DIR_ABS, album, bigThumbName),
      absOutputDir,
      bigThumbName
    );
    const smallThumbRel = `${relDir}/${smallThumbName}`;
    const shotTime = new Date(
      exif.DateTimeOriginal || exif.CreateDate || Date.now
    );
    const photo = new photoSchema({
      filename: file.filename,
      size: file.size,
      album: file.album || "",
      originalName: file.originalname,
      tags: file.tags || [],
      mimetype: file.mimetype,
      album: album,
      path: url,
      bigThumbPath: bigThumbRel,
      smallThumbPath: smallThumbRel,
      camera: {
        make: exif.Make || "未知",
        model: exif.Model || "未知",
        iso: exif.ISO || null,
        focalLength: exif.FocalLength || null,
        shutterSpeed: exif?.ExposureTime || null,
      },
      shotTime,
      width: exif.ExifImageWidth || exif.ImageWidth,
      height: exif.ExifImageHeight || exif.ImageHeight,
      updateAt: Date.now(),
    });
    const saved = await photo.save();
    successResponse(res, saved, "图片上传成功");
  } catch (err) {
    errorResponse(res, SERVER_ERROR, err.message, 500);
  }
};
// 多张图片上传
const uploadMultiple = async (req, res) => {
  if (!req.files) {
    return errorResponse(res, PARAM_MISSING, "文件为空，请重新检查", 400);
  }
  try {
    const album = req.query.album?.trim();
    const savedList = [];
    req.files.map(async (file) => {
      // 获取exif信息
      let exif = {};
      exif = await exifr.parse(file.path, {
        gps: true,
        tiff: true,
        ifd0: true,
        exif: true,
      });
      if (!exif) {
        exif = await exifr.parse(file.path);
      }
      // 图片浏览路径
      const url = album
        ? `/${UPLOAD_DIR_NAME}/${album}/${file.filename}`
        : `/${UPLOAD_DIR_NAME}/${file.filename}`;
      // 创建图片存储路径
      const relDir = album
        ? `/${UPLOAD_DIR_NAME}/${album}`
        : `/${UPLOAD_DIR_NAME}`;
      // 创建缩略图路径
      const absInput = file.path;
      const absOutputDir = album
        ? path.join(UPLOAD_DIR_ABS, album)
        : UPLOAD_DIR_ABS;
      // 创建较大缩略图
      const { thumbnailName: bigThumbName } = await mkThumbnail(
        absInput,
        absOutputDir,
        file.filename,
        1200
      );
      const bigThumbRel = `${relDir}/${bigThumbName}`;
      // 创建最小缩略图
      const { thumbnailName: smallThumbName } = await mkThumbnail(
        path.join(UPLOAD_DIR_ABS, album, bigThumbName),
        absOutputDir,
        bigThumbName
      );
      const smallThumbRel = `${relDir}/${smallThumbName}`;
      const shotTime = new Date(
        exif.DateTimeOriginal || exif.CreateDate || Date.now
      );
      const photo = new photoSchema({
        filename: file.filename,
        size: file.size,
        album: file.album || "",
        originalName: file.originalname,
        tags: file.tags || [],
        mimetype: file.mimetype,
        album: album,
        path: url,
        bigThumbPath: bigThumbRel,
        smallThumbPath: smallThumbRel,
        camera: {
          make: exif.Make || "未知",
          model: exif.Model || "未知",
          iso: exif.ISO || null,
          focalLength: exif.FocalLength || null,
          shutterSpeed: exif?.ExposureTime || null,
        },
        shotTime,
        width: exif.ExifImageWidth || exif.ImageWidth,
        height: exif.ExifImageHeight || exif.ImageHeight,
        updateAt: Date.now(),
      });
      const saved = await photo.save();
      savedList.push(saved);
      return await saved;
    });
    successResponse(res, savedList, "所有文件上传成功");
  } catch (err) {
    errorResponse(res, SERVER_ERROR, err.message, 500);
  }
};
// 单张图片删除
const deleteSingle = async (req, res) => {
  const photoId = await req.params.id;
  if (!photoId) {
    errorResponse(res, PARAM_MISSING, "id参数缺失", 400);
  }
  try {
    const photo = await photoSchema.findById(photoId);
    if (!photo) {
      return errorResponse(res, RESOURCE_NOT_FIND, "未从数据中获取到文件", 404);
    }
    const filepath = path.join(__dirname, "..", photo.path);
    const smallThumbPath = path.join(__dirname, "..", photo.smallThumbPath);
    const bigThumbPath = path.join(__dirname, "..", photo.bigThumbPath);
    try {
      await fs.unlink(filepath);
      await fs.unlink(smallThumbPath);
      await fs.unlink(bigThumbPath);
    } catch (err) {
      errorResponse(res, RESOURCE_DELETE_FAIL, err.message, 404);
    }
    const deleted = await photoSchema.findByIdAndDelete(photoId);
    successResponse(res, deleted, "文件删除成功");
  } catch (err) {
    errorResponse(res, SERVER_ERROR, err.message, 500);
  }
};
// 多张图片删除
const deleteMultiple = async (req, res) => {
  const { photoId } = req.body;
  if (!photoId) {
    errorResponse(res, PARAM_MISSING, photoId, 400);
  }
  const successList = [];
  const failList = [];
  try {
    photoId.map(async (id) => {
      const photo = await photoSchema.findById(id);
      const filepath = path.join(__dirname, "..", photo.path);
      const smallThumbPath = path.join(__dirname, "..", photo.smallThumbPath);
      const bigThumbPath = path.join(__dirname, "..", photo.bigThumbPath);
      try {
        await fs.unlink(filepath);
        await fs.unlink(smallThumbPath);
        await fs.unlink(bigThumbPath);
      } catch (err) {
        return failList.push({ id: id, error: err.message });
      }
      await photoSchema.findOneAndDelete(id);
      successList.push({ id: id });
    });
    successResponse(res, { successList, failList }, "删除操作完成");
  } catch (err) {
    errorResponse(res, SERVER_ERROR, err.message, 500);
  }
};
// 获取全部照片
const getImages = async (req, res) => {
  try {
    const photos = await photoSchema
      .find()
      .sort({ shotTime: -1, updateAt: -1 });
    const fullPhotos = photos.map((photo) => {
      photo.shotTime = photo.shotTime.toISOString();
      return {
        ...photo.toObject(),
      };
    });
    successResponse(res, fullPhotos, "图片列表获取成功");
  } catch (err) {
    errorResponse(res, SERVER_ERROR, err.message, 500);
  }
};
// 根据相册获取照片
const getImagesByAlbum = async (req, res) => {
  try {
    const album = req.query.album;
    if (!album) {
      return errorResponse(res, PARAM_MISSING, "未获取到相册名", 400);
    }
    const filter = { album };
    const photos = (
      await photoSchema.find(filter).sort({ shotAt: -1, updateAt: -1 })
    ).map((photo) => {
      return {
        id: photo._id,
        thumbnailUrl: `${req.protocol}://${req.get("host")}${
          photo.thumbnailPath
        }`,
        url: `${req.protocol}://${req.get("host")}${photo.path}`,
        ...photo.toObject(),
      };
    });
    if (photos.length === 0) {
      return errorResponse(
        res,
        DB_ERROR,
        `数据库中未查询到${album}的文件`,
        404
      );
    }
    return successResponse(res, { photos, album: album });
  } catch (err) {
    return errorResponse(res, SERVER_ERROR, err.message, 500);
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
