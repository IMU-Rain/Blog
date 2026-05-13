const path = require("path");
const fs = require("fs/promises");
const https = require("https");
const { URL } = require("url"); // 用于解析API地址
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
  RESOURCE_DELETE_FAIL,
} = require("../utils/errorTypes");
// 图片上传
const photoUpload = async (req, res) => {
  try {
    const album = req.body.album || "default";
    const ids = Array.isArray(req.body.id) ? req.body.id : [];
    let createdCount = 0;
    let skippedCount = 0;

    if (ids.length === 0) {
      return errorResponse(res, PARAM_MISSING, "未获取到id", 400);
    }

    for (const id of ids) {
      const fileDoc = await fileSchema.findById(id);
      if (!fileDoc) {
        return errorResponse(
          res,
          RESOURCE_NOT_FIND,
          `未从数据库中查询到文件: ${id}`,
          404,
        );
      }
      const normalizedFileName = String(fileDoc.fileName || "").trim();
      if (!normalizedFileName) {
        return errorResponse(res, PARAM_MISSING, `文件名为空: ${id}`, 400);
      }

      const existed = await photoSchema.findOne({
        $or: [
          { fileId: String(id) },
          { fileName: normalizedFileName },
          { filename: normalizedFileName },
        ],
      });
      if (existed) {
        skippedCount += 1;
        continue;
      }

      const relativePath = String(fileDoc.path || "").replace(/^[/\\]+/, "");
      const absolutePath = path.join(__dirname, "..", relativePath);

      const exif =
        (await exifr.parse(absolutePath, {
          gps: true,
          tiff: true,
          ifd0: true,
          exif: true,
        })) || {};

      const url = fileDoc.url;
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
      let shotTime = new Date(
        exif.DateTimeOriginal || exif.CreateDate || Date.now(),
      );
      if (Number.isNaN(shotTime.getTime())) {
        shotTime = new Date();
      }
      await new photoSchema({
        filename: normalizedFileName,
        fileName: normalizedFileName,
        fileId: id,
        size: fileDoc.size,
        album,
        originalName: fileDoc.originalName,
        url,
        bigThumbUrl,
        smallThumbUrl,
        camera: {
          make: exif.Make || "未知",
          model: exif.Model || "未知",
          iso: exif.ISO || null,
          focalLength: exif.FocalLength || null,
          shutterSpeed: exif.ExposureTime || null,
        },
        shotTime,
        width: exif.ExifImageWidth || exif.ImageWidth || null,
        height: exif.ExifImageHeight || exif.ImageHeight || null,
        updateAt: Date.now(),
      }).save();
      createdCount += 1;
    }
    successResponse(
      res,
      { created: createdCount, skipped: skippedCount },
      undefined,
      "照片上传成功",
    );
  } catch (err) {
    errorResponse(res, SERVER_ERROR, err.message, 500);
  }
};
// 图片AI总结生成
async function createExpert(req, res) {
  const photoId = req.body.id;
  // 智谱AI的对话API端点
  const apiUrl = "https://open.bigmodel.cn/api/paas/v4/chat/completions";
  // 解析URL为hostname/path，方便构建https请求参数
  const parsedUrl = new URL(apiUrl);
  const photo = await photoSchema.findById(photoId);
  if (!photo)
    return errorResponse(
      res,
      RESOURCE_NOT_FIND,
      `未找到id为${photoId}的照片，请检查`,
      302,
    );
  const image_url = process.env.SERVER_URL + photo.smallThumbUrl.slice(2);
  // 构建请求头
  const headers = {
    "Content-Type": "application/json",
    Authorization: `Bearer ${process.env.ZHIPU_API_KEY}`,
  };
  // 构建请求体（与原代码参数完全一致）
  const requestBody = JSON.stringify({
    model: "glm-4.1v-thinking-flashx", // 模型名称
    messages: [
      {
        role: "user",
        content: [
          {
            type: "text",
            text: `这是一个摄影照片，请你生成一段40个中文字符的介绍`,
          },
          {
            type: "image_url",
            image_url: {
              url: image_url,
            },
          },
        ],
      },
    ],
  });

  // 封装https请求为Promise
  const requestPromise = new Promise((resolve, reject) => {
    // 配置https请求选项
    const options = {
      hostname: parsedUrl.hostname,
      path: parsedUrl.pathname,
      method: "POST",
      headers: {
        ...headers,
        "Content-Length": Buffer.byteLength(requestBody), // 必须指定请求体长度
      },
    };

    // 创建请求
    const req = https.request(options, (res) => {
      let responseData = "";

      // 接收响应数据（流式）
      res.on("data", (chunk) => {
        responseData += chunk;
      });

      // 响应接收完成
      res.on("end", () => {
        // 检查HTTP状态码
        if (res.statusCode >= 200 && res.statusCode < 300) {
          try {
            const result = JSON.parse(responseData);
            resolve(result);
          } catch (parseError) {
            reject(new Error(`解析响应失败: ${parseError.message}`));
          }
        } else {
          reject(
            new Error(
              `API请求失败，状态码: ${res.statusCode}, 响应: ${responseData}`,
            ),
          );
        }
      });
    });

    // 请求错误处理
    req.on("error", (error) => {
      reject(new Error(`请求发送失败: ${error.message}`));
    });

    // 发送请求体
    req.write(requestBody);
    // 结束请求
    req.end();
  });

  try {
    // 发送请求并获取响应
    const response = await requestPromise;
    const content = response.choices[0].message.content;

    successResponse(res, content, "摘要获取成功");
  } catch (error) {
    // 错误处理：打印详细信息并抛出

    console.error("调用智谱AI API失败：", error.message);
    errorResponse(res, SERVER_ERROR, error.message, 500);
  }
}
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
        return errorResponse(res, RESOURCE_NOT_FIND, "请检查传入id", 404);
      }
      const file = await fileSchema.findById(photo.fileId);
      if (!file) {
        return errorResponse(res, RESOURCE_NOT_FIND, "请检查传入id", 404);
      }
      const filepath = path.join(__dirname, "..", file.path);
      const smallThumbPath = path.join(__dirname, "..", photo.smallThumbUrl);
      const bigThumbPath = path.join(__dirname, "..", photo.bigThumbUrl);
      try {
        await fs.unlink(filepath);
        await fs.unlink(smallThumbPath);
        await fs.unlink(bigThumbPath);
      } catch (err) {
        return errorResponse(res, RESOURCE_DELETE_FAIL, err.message, 404);
      }
      await photo.deleteOne()
      await fileSchema.findOneAndDelete(photo.fileId);
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
      return errorResponse(res, PARAM_MISSING, "未获取到相册", 400);
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

// 获取单张图片详情
const getPhotoDetail = async (req, res) => {
  try {
    const { id } = req.params;
    if (!id) {
      return errorResponse(res, PARAM_MISSING, "id参数缺失", 400);
    }

    const photo = await photoSchema.findById(id);
    if (!photo) {
      return errorResponse(res, RESOURCE_NOT_FIND, "图片不存在", 404);
    }

    return successResponse(res, photo, undefined, "图片详情获取成功");
  } catch (err) {
    return errorResponse(res, SERVER_ERROR, err.message, 500);
  }
};

// 更新图片元信息（名称、描述、相册、标签等）
const updatePhotoMeta = async (req, res) => {
  try {
    const { id } = req.params;
    if (!id) {
      return errorResponse(res, PARAM_MISSING, "id参数缺失", 400);
    }

    const { name, originalName, description, album, tags } = req.body || {};
    const updateData = {
      updateAt: Date.now(),
    };

    if (typeof name === "string" && name.trim()) {
      updateData.originalName = name.trim();
    }
    if (typeof originalName === "string" && originalName.trim()) {
      updateData.originalName = originalName.trim();
    }
    if (typeof description === "string") {
      updateData.description = description.trim();
    }
    if (typeof album === "string" && album.trim()) {
      updateData.album = album.trim();
    }
    if (Array.isArray(tags)) {
      updateData.tags = tags.map((tag) => String(tag).trim()).filter(Boolean);
    } else if (typeof tags === "string") {
      updateData.tags = tags
        .split(/[,，\n]/)
        .map((tag) => tag.trim())
        .filter(Boolean);
    }

    const updatableKeys = Object.keys(updateData).filter(
      (key) => key !== "updateAt",
    );
    if (updatableKeys.length === 0) {
      return errorResponse(res, PARAM_MISSING, "未提供可更新字段", 400);
    }

    const updated = await photoSchema.findByIdAndUpdate(id, updateData, {
      new: true,
    });
    if (!updated) {
      return errorResponse(res, RESOURCE_NOT_FIND, "图片不存在", 404);
    }

    return successResponse(res, updated, undefined, "图片信息更新成功");
  } catch (err) {
    return errorResponse(res, SERVER_ERROR, err.message, 500);
  }
};
module.exports = {
  getImagesByAlbum,
  createExpert,
  photoUpload,
  photoDelete,
  getImages,
  getPhotoDetail,
  updatePhotoMeta,
};
