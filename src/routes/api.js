const express = require('express');
const router = express.Router();
const {validateUpsertUser } = require('../validators/userValidator');

const {upsertUser, getUsers, deleteUser, getUserById} = require('../controllers/HomeController');

router.get('/users', getUsers);
router.get('/users/:id', getUserById);

router.post('/users',validateUpsertUser , upsertUser);
router.put('/users/:id',validateUpsertUser , upsertUser);

router.delete('/users/:id', deleteUser);


module.exports=router;