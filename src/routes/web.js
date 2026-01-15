const express = require('express');

const {getHomePage,
    postCreateUser, getCreatePage, getUpdatePage, postUpdateUser, postDeleteUser,
    postHandleRemoveUser
} = require('../controllers/HomeController')
const router = express.Router();

// router.Method('/route', handler); //cau truc chung
router.get('/', getHomePage);



router.post('/create-user',postCreateUser)
router.get('/create', getCreatePage);
router.get('/update/:id', getUpdatePage)
router.post('/update-user',postUpdateUser)
router.post('/delete-user/:id', postDeleteUser);
router.post('/delete-user', postHandleRemoveUser);
module.exports = router;