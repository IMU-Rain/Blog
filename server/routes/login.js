const router = require("express").Router();
const authmeController = require("../controllers/authmeController");
const loginController = require("../controllers/loginController");
const authMiddleware = require("../middlewares/authMiddleware");
router.get("/",authMiddleware, authmeController);
router.post("/", loginController);
module.exports = router;
