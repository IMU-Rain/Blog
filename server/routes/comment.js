const router = require("express").Router();
const commentController = require("../controllers/commentController");
const authMiddleware = require("../middlewares/authMiddleware");
const adminOnly = require("../middlewares/adminOnlyMiddleware");

router.get("/admin", authMiddleware, adminOnly, commentController.getAdminComments);
router.get("/", commentController.getComments);
router.post("/", authMiddleware, commentController.createComment);
router.put("/:id", authMiddleware, commentController.updateComment);
router.delete("/:id", authMiddleware, adminOnly, commentController.deleteComment);

module.exports = router;
