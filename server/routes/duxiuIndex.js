const router = require("express").Router();
const duxiuIndexController = require("../controllers/duxiuIndexController");
const authMiddleware = require("../middlewares/authMiddleware");
const adminOnly = require("../middlewares/adminOnlyMiddleware");
router.post("/", authMiddleware, adminOnly, duxiuIndexController.createDuxiuIndex);
router.get("/", duxiuIndexController.getDuxiuIndex);
router.put("/", authMiddleware, adminOnly, duxiuIndexController.updateDuxiuIndex);
module.exports = router;
