const router = require("express").Router();
const authController = require("../controllers/authController");
const { register } = require("../validators/user.validation");
const {checkTokenExpiry } = require('../middleware/checkTokenExpiry');




const middlewareController = require("../middleware/auth.middleware")

router.post("/register", register, authController.register);
router.post("/login", authController.login);

//refresh token
router.post("/refresh", checkTokenExpiry ,authController.refreshToken);

//logout
router.post("/logout", middlewareController.verifyToken,authController.logout);
router.get('/me', middlewareController.verifyToken, authController.getMe);
module.exports = router;
