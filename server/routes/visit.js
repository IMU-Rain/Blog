const router = require("express").Router();
const visitController = require("../controllers/visitController.js");
router.get("/", visitController.getVisit);
router.get("/map", visitController.getVisitMap);
module.exports = router;
