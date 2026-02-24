const path = require("path");
const fs = require("fs/promises");
const {
  UPLOAD_DIR_NAME,
  UPLOAD_DIR_ABS_THUMBNAIL,
  UPLOAD_DIR_ABS_THUMBNAIL_DOUBLE,
} = require("../middlewares/uploads");
const photoSchema = require("../models/photo");
const fileSchema = require("../models/File");
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
  RESOURCE_NOT_FIND,
} = require("../utils/errorTypes");
// 图片上传
const photoUpload = async (req, res) => {
  try {
    let { albums } = req.body;
    if (!albums) albums = "default";
    for (const id of req.body.id) {
      const fileDoc = await fileSchema.findById(id);
      const relativePath = fileDoc.url.replace(/^\/+/, "/");
      // 2️⃣ 拼接成绝对路径
      const absolutePath = path.join(
        __dirname,
        "..",
        relativePath, // uploads/xxx.jpg
      );
      // 3️⃣ 现在可以安全读文件
      const file = await fs.readFile(absolutePath);
      // 获取exif信息
      let exif = {};
      exif = await exifr.parse(absolutePath, {
        gps: true,
        tiff: true,
        ifd0: true,
        exif: true,
      });
      if (!exif) {
        exif = await exifr.parse(file.path);
      }
      // 图片浏览路径
      const url = fileDoc.url;
      // 创建较大缩略图
      const { thumbnailName: bigThumbName } = await mkThumbnail(
        absolutePath,
        UPLOAD_DIR_ABS_THUMBNAIL,
        fileDoc.fileName,
        1200,
      );
      const bigThumbUrl = path.join(
        UPLOAD_DIR_NAME,
        "/thumbnail",
        bigThumbName,
      );
      // // 创建最小缩略图
      const { thumbnailName: smallThumbName } = await mkThumbnail(
        path.join(UPLOAD_DIR_ABS_THUMBNAIL, bigThumbName),
        UPLOAD_DIR_ABS_THUMBNAIL_DOUBLE,
        bigThumbName,
      );
      const smallThumbUrl = path.join(
        UPLOAD_DIR_NAME,
        "/thumbnailDouble",
        smallThumbName,
      );
      const shotTime = new Date(
        exif.DateTimeOriginal || exif.CreateDate || Date.now,
      );
      await new photoSchema({
        fileName: fileDoc.fileName,
        fileId: id,
        size: fileDoc.size,
        album: file.album || "default",
        originalName: fileDoc.originalName,
        url,
        bigThumbUrl: bigThumbUrl,
        smallThumbUrl: smallThumbUrl,
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
      }).save();
    }
    successResponse(res, "", "图片上传成功");
  } catch (err) {
    errorResponse(res, SERVER_ERROR, err.message, 500);
  }
};

// 图片删除
const photoDelete = async (req, res) => {
  const photoId = req.body.id;
  if (!photoId) {
    return errorResponse(res, PARAM_MISSING, "id参数缺失", 400);
  }
  try {
    for (const id of photoId) {
      const photo = await photoSchema.findById(id);
      if (!photo) {
        return errorResponse(res, RESOURCE_NOT_FIND, "id不存在,请检查", 404);
      }
      const filepath = path.join(__dirname, "..", photo.url);
      const smallThumbPath = path.join(__dirname, "..", photo.smallThumbUrl);
      const bigThumbPath = path.join(__dirname, "..", photo.bigThumbUrl);
      try {
        await fs.unlink(filepath);
        await fs.unlink(smallThumbPath);
        await fs.unlink(bigThumbPath);
      } catch (err) {
        return errorResponse(res, RESOURCE_DELETE_FAIL, err.message, 404);
      }
      await photoSchema.findByIdAndDelete(photoId);
      await fileSchema.findByIdAndDelete(photo.fileId);
    }
    successResponse(res, "文件删除成功");
  } catch (err) {
    console.log(err);
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
    successResponse(res, fullPhotos, fullPhotos.length, "图片列表获取成功");
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
        404,
      );
    }
    return successResponse(res, { photos, album: album });
  } catch (err) {
    return errorResponse(res, SERVER_ERROR, err.message, 500);
  }
};
module.exports = {
  getImagesByAlbum,
  photoUpload,
  photoDelete,
  getImages,
};
