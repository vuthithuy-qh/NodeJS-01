const router = require('express').Router();

const userController = require('../controllers/userController');
const authMiddleware = require('../middleware/auth.middleware');
const pagination = require("../middleware/pagination.middleware")

router.get(
    '/users',
    authMiddleware.verifyToken,
    authMiddleware.verifyAdmin,
    pagination,
    userController.getAllUsersForAdmin
);

module.exports = router;