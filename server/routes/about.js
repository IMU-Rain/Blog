const router = require("express").Router();
const aboutController = require("../controllers/aboutController");
router.get("/", aboutController.getAbout);
router.post("/", aboutController.createAbout);
router.put("/", aboutController.updateAbout);
module.exports = router;
