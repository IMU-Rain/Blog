type CommentTargetType = "article" | "photo";

interface CommentAuthor {
  _id: string;
  username: string;
  nickname?: string;
  avatar?: string;
  role?: "admin" | "user";
}

interface CommentItem {
  _id: string;
  targetType: CommentTargetType;
  targetId: string;
  content: string;
  author: CommentAuthor;
  parentId?: string | null;
  status: "published" | "hidden";
  createAt: string;
  updateAt: string;
}

interface CommentQuery {
  targetType: CommentTargetType;
  targetId: string;
}

interface CreateCommentPayload extends CommentQuery {
  content: string;
  parentId?: string | null;
}

export type {
  CommentAuthor,
  CommentItem,
  CommentQuery,
  CommentTargetType,
  CreateCommentPayload,
};
