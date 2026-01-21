const router = require('express').Router();

const userController = require('../controllers/userController');
const authMiddleware = require('../middleware/auth.middleware');
const pagination = require("../middleware/pagination.middleware")



router.delete('/:id',
    authMiddleware.verifyToken,
    authMiddleware.verifyAdmin,
    userController.deleteUser);

router.get(
    '/',
    authMiddleware.verifyToken,
    pagination,
    userController.getPublishUsers
);

module.exports = router;