const router = require("express").Router();
const visitController = require("../controllers/visitController.js");
router.get("/", visitController.getVisit);
module.exports = router;
