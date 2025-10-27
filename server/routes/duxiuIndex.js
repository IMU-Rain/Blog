const router = require("express").Router();
const duxiuIndexController = require("../controllers/duxiuIndexController");
router.post("/", duxiuIndexController.createDuxiuIndex);
router.get("/", duxiuIndexController.getDuxiuIndex);
router.put("/", duxiuIndexController.updateDuxiuIndex);
module.exports = router;
