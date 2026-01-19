const router = require('express').Router();

const userController = require('../controllers/userController');
const authMiddleware = require('../middleware/auth.middleware');
router.get('/',authMiddleware.verifyToken, userController.getAllUser);

router.delete('/:id',authMiddleware.verifyToken,authMiddleware.verifyAdmin, userController.deleteUser);

module.exports = router;