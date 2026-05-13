const router = require("express").Router();
const userController = require("../controllers/userController");
const authMiddleware = require("../middlewares/authMiddleware");
const adminOnly = require("../middlewares/adminOnlyMiddleware");

router.get("/admin", authMiddleware, adminOnly, userController.getAdminUsers);
router.delete("/:id", authMiddleware, adminOnly, userController.deleteUser);

module.exports = router;
