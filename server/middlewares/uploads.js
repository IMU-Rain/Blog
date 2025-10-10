const multer = require("multer");
const path = require("path");
const fsPromises = require("fs/promises");
// 允许的文件类型
const ALLOWED_MIME = ["image/jpeg", "image/png", "image/gif", "image/webp"];
const UPLOAD_DIR_NAME = process.env.UPLOAD_DIR || "uploads";
const UPLOAD_DIR_NAME_COVER = process.env.UPLOAD_DIR || "uploads/covers";
const UPLOAD_DIR_NAME_ARTICLE =
  process.env.UPLOAD_DIR || "uploads/articleimage";
// 上传的绝对路径
const UPLOAD_DIR_ABS = path.join(__dirname, "..", UPLOAD_DIR_NAME);
const UPLOAD_DIR_ABS_COVER = path.join(__dirname, "..", UPLOAD_DIR_NAME_COVER);
const UPLOAD_DIR_ABS_ARTICLE = path.join(
  __dirname,
  "..",
  UPLOAD_DIR_NAME_ARTICLE
);

// 确保项目首次启动时自动创建
async function ensureUploadDir(params) {
  try {
    await fsPromises.mkdir(UPLOAD_DIR_ABS, { recursive: true });
  } catch (err) {
    throw err;
  }
}
ensureUploadDir();
// 生成文件名
function buildFileName(originalName) {
  const ext = path.extname(originalName).toLowerCase();
  const rand = Math.random().toString(36).slice(2, 8);
  return `${Date.now()}_${rand}${ext}`;
}
// 检查文件类型
function fileFilter(req, file, cb) {
  if (!ALLOWED_MIME.includes(file.mimetype)) {
    return cb(
      new multer.MulterError(
        "LIMIT_UNEXPECTED_FILE",
        `不支持的图片类型：${file.originalname} (${file.mimetype})`
      )
    );
  }
  cb(null, true);
}
// 文章内含图片存储
const articleImageStorage = multer.diskStorage({
  destination: async (req, file, cb) => {
    const targetDir = UPLOAD_DIR_ABS_ARTICLE;
    await fsPromises.mkdir(targetDir, { recursive: true });
    file._uploadTargetDir = targetDir;
    cb(null, targetDir);
  },
  filename: (req, file, cb) => {
    try {
      const safeName = buildFileName(file.originalname);
      cb(null, safeName);
    } catch (err) {
      console.log(err);
      cb(err);
    }
  },
});
// 封面存储
const coverStorage = multer.diskStorage({
  destination: async (req, file, cb) => {
    const targetDir = UPLOAD_DIR_ABS_COVER;
    await fsPromises.mkdir(targetDir, { recursive: true });
    file._uploadTargetDir = targetDir;
    cb(null, targetDir);
  },
  filename: (req, file, cb) => {
    try {
      const safeName = buildFileName(file.originalname);
      cb(null, safeName);
    } catch (err) {
      cb(err);
    }
  },
});
// 图片存储
const imageStorage = multer.diskStorage({
  destination: async (req, file, cb) => {
    const album = req.query?.album;
    const targetDir = album ? path.join(UPLOAD_DIR_ABS, album) : UPLOAD_DIR_ABS;
    fsPromises
      .mkdir(targetDir, { recursive: true })
      .then(() => {
        file._uploadTargetDir = targetDir;
        cb(null, targetDir);
      })
      .catch((err) => {
        console.log(err);
      });
  },
  filename: (req, file, cb) => {
    try {
      const safeName = buildFileName(file.originalname);
      cb(null, safeName);
    } catch (err) {
      cb(err);
    }
  },
});

// 图片上传
const imageUploader = multer({
  storage: imageStorage,
  fileFilter,
  limits: {
    fileSize: Number(process.env.MAX_FILE_SIZE_MB || 30) * 1024 * 1024,
    files: 20,
  },
});
// 封面上传
const coverUploader = multer({
  storage: coverStorage,
  fileFilter,
  limits: {
    fileSize: Number(process.env.MAX_FILE_SIZE_MB || 30) * 1024 * 1024,
    files: 1,
  },
});
// 文章内图片上传
const articleImgUploader = multer({
  storage: articleImageStorage,
  fileFilter,
  limits: {
    fileSize: Number(process.env.MAX_FILE_SIZE_MB || 30) * 1024 * 1024,
    files: 15,
  },
});
// 导出常用中间件
const coverImage = (req, res, next) => {
  coverUploader.single("cover")(req, res, next);
};
const articleImage = (req, res, next) => {
  articleImgUploader.array("image")(req, res, next);
};
const singleImage = (req, res, next) => {
  imageUploader.single("image")(req, res, next);
};
const multipleImages = (req, res, next) => {
  imageUploader.array((fieldName = "image"), 20)(req, res, next);
};
function isMulterError(err) {
  return err instanceof multer.MulterError;
}
module.exports = {
  coverImage,
  articleImage,
  singleImage,
  multipleImages,
  isMulterError,
  UPLOAD_DIR_NAME_ARTICLE,
  UPLOAD_DIR_ABS,
  UPLOAD_DIR_NAME_COVER,
  UPLOAD_DIR_ABS_ARTICLE,
  UPLOAD_DIR_NAME,
  UPLOAD_DIR_ABS_COVER,
};
