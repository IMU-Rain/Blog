const router = require("express").Router();
const photosController = require("../controllers/photosController");
router.post("/", photosController.photoUpload);
router.delete("/", photosController.photoDelete);
router.get("/", photosController.getImages);
router.get("/album", photosController.getImagesByAlbum);
module.exports = router;
