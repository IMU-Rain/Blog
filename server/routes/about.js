const router = require("express").Router();
const aboutController = require("../controllers/aboutController");
const authMiddleware = require("../middlewares/authMiddleware");
const adminOnly = require("../middlewares/adminOnlyMiddleware");
router.get("/", aboutController.getAbout);
router.post("/", authMiddleware, adminOnly, aboutController.createAbout);
router.put("/", authMiddleware, adminOnly, aboutController.updateAbout);
module.exports = router;
