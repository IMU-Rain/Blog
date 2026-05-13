const router = require("express").Router();
const authmeController = require("../controllers/authmeController");
const {
  loginController,
  logoutController,
  registerController,
} = require("../controllers/loginController");
const authMiddleware = require("../middlewares/authMiddleware");
router.get("/", authMiddleware, authmeController);
router.post("/", loginController);
router.post("/register", registerController);
router.post("/logout", logoutController);
module.exports = router;
