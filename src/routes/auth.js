const router = require("express").Router();

const authController = require("../controllers/authController");

const middlewareController = require("../controllers/middlewareController")
router.post("/register", authController.registerUser);
router.post("/login", authController.loginUser);

//refresh token
router.post("/refresh", authController.requestRefreshToken);

//logout
router.post("/logout", middlewareController.verifyToken,authController.userLogout);
module.exports = router;
