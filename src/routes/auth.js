const router = require("express").Router();
const authController = require("../controllers/authController");
const { register } = require("../validators/user.validation");





const middlewareController = require("../middleware/auth.middleware")

router.post("/register", register, authController.register);
router.post("/login", authController.login);

//refresh token
router.post("/refresh", authController.refreshToken);

//logout
router.post("/logout", middlewareController.verifyToken,authController.logout);
module.exports = router;
