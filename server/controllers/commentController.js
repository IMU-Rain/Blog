const mongoose = require("mongoose");
const Comment = require("../models/comment");
const Article = require("../models/article");
const Photo = require("../models/photo");
const {
  successResponse,
  errorResponse,
} = require("../middlewares/responseHandler");
const {
  PARAM_MISSING,
  PARAM_ERROR,
  RESOURCE_NOT_FIND,
  SERVER_ERROR,
  PERMISSION_DENIED,
} = require("../utils/errorTypes");

const targetModels = {
  article: Article,
  photo: Photo,
};

const authorSelect = "username nickname avatar role";

function isObjectId(id) {
  return mongoose.Types.ObjectId.isValid(id);
}

async function assertTargetExists(targetType, targetId) {
  const Model = targetModels[targetType];
  if (!Model) return false;
  const target = await Model.findById(targetId).select("_id");
  return Boolean(target);
}

function canManageComment(user, comment) {
  return (
    user?.role === "admin" ||
    String(comment.author?._id || comment.author) === String(user?.id)
  );
}

const getComments = async (req, res) => {
  const { targetType, targetId } = req.query;
  if (!targetType || !targetId) {
    return errorResponse(res, PARAM_MISSING, "缺少评论目标", 400);
  }
  if (!targetModels[targetType] || !isObjectId(targetId)) {
    return errorResponse(res, PARAM_ERROR, "评论目标参数不正确", 400);
  }

  try {
    const exists = await assertTargetExists(targetType, targetId);
    if (!exists) {
      return errorResponse(res, RESOURCE_NOT_FIND, "评论目标不存在", 404);
    }

    const comments = await Comment.find({
      targetType,
      targetId,
      status: "published",
    })
      .populate("author", authorSelect)
      .sort({ createAt: 1 });

    successResponse(res, comments, comments.length, "评论列表获取成功");
  } catch (err) {
    errorResponse(res, SERVER_ERROR, err.message, 500);
  }
};

const getAdminComments = async (_req, res) => {
  try {
    const comments = await Comment.find({ status: "published" })
      .populate("author", authorSelect)
      .sort({ createAt: -1 });

    const data = await Promise.all(
      comments.map(async (comment) => {
        const Model = targetModels[comment.targetType];
        const target = Model
          ? await Model.findById(comment.targetId).select(
              "title originalName filename fileName",
            )
          : null;
        const targetTitle =
          target?.title ||
          target?.originalName ||
          target?.filename ||
          target?.fileName ||
          "目标已删除";
        return {
          ...comment.toObject(),
          targetTitle,
        };
      }),
    );

    successResponse(res, data, data.length, "评论管理列表获取成功");
  } catch (err) {
    errorResponse(res, SERVER_ERROR, err.message, 500);
  }
};

const createComment = async (req, res) => {
  const { targetType, targetId, content, parentId } = req.body || {};
  const normalizedContent = String(content || "").trim();
  if (!targetType || !targetId || !normalizedContent) {
    return errorResponse(res, PARAM_MISSING, "缺少评论内容或目标", 400);
  }
  if (!targetModels[targetType] || !isObjectId(targetId)) {
    return errorResponse(res, PARAM_ERROR, "评论目标参数不正确", 400);
  }
  if (normalizedContent.length > 1000) {
    return errorResponse(res, PARAM_ERROR, "评论内容不能超过1000字", 400);
  }
  if (parentId && !isObjectId(parentId)) {
    return errorResponse(res, PARAM_ERROR, "回复目标参数不正确", 400);
  }

  try {
    const exists = await assertTargetExists(targetType, targetId);
    if (!exists) {
      return errorResponse(res, RESOURCE_NOT_FIND, "评论目标不存在", 404);
    }
    if (parentId) {
      const parent = await Comment.findOne({
        _id: parentId,
        targetType,
        targetId,
        status: "published",
      });
      if (!parent) {
        return errorResponse(res, RESOURCE_NOT_FIND, "回复的评论不存在", 404);
      }
    }

    const comment = await new Comment({
      targetType,
      targetId,
      content: normalizedContent,
      parentId: parentId || null,
      author: req.user.id,
    }).save();
    const populated = await Comment.findById(comment._id).populate(
      "author",
      authorSelect,
    );
    successResponse(res, populated, undefined, "评论发布成功");
  } catch (err) {
    errorResponse(res, SERVER_ERROR, err.message, 500);
  }
};

const updateComment = async (req, res) => {
  const { id } = req.params;
  const content = String(req.body?.content || "").trim();
  if (!id || !isObjectId(id)) {
    return errorResponse(res, PARAM_ERROR, "评论ID不正确", 400);
  }
  if (!content) {
    return errorResponse(res, PARAM_MISSING, "评论内容不能为空", 400);
  }
  if (content.length > 1000) {
    return errorResponse(res, PARAM_ERROR, "评论内容不能超过1000字", 400);
  }

  try {
    const comment = await Comment.findById(id);
    if (!comment || comment.status !== "published") {
      return errorResponse(res, RESOURCE_NOT_FIND, "评论不存在", 404);
    }
    if (!canManageComment(req.user, comment)) {
      return errorResponse(res, PERMISSION_DENIED, "只能修改自己的评论", 403);
    }
    comment.content = content;
    await comment.save();
    const populated = await Comment.findById(id).populate(
      "author",
      authorSelect,
    );
    successResponse(res, populated, undefined, "评论更新成功");
  } catch (err) {
    errorResponse(res, SERVER_ERROR, err.message, 500);
  }
};

const deleteComment = async (req, res) => {
  const { id } = req.params;
  if (!id || !isObjectId(id)) {
    return errorResponse(res, PARAM_ERROR, "评论ID不正确", 400);
  }

  try {
    const comment = await Comment.findById(id);
    if (!comment || comment.status !== "published") {
      return errorResponse(res, RESOURCE_NOT_FIND, "评论不存在", 404);
    }
    if (!canManageComment(req.user, comment)) {
      return errorResponse(res, PERMISSION_DENIED, "只能删除自己的评论", 403);
    }
    comment.status = "hidden";
    await comment.save();
    successResponse(res, { id }, undefined, "评论删除成功");
  } catch (err) {
    errorResponse(res, SERVER_ERROR, err.message, 500);
  }
};

module.exports = {
  getComments,
  getAdminComments,
  createComment,
  updateComment,
  deleteComment,
};
