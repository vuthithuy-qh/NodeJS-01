const express = require('express');
const router = express.Router();
const {validateUpsertUser, validate } = require('../validators/userValidator');

const {upsertUser, getUsers, deleteUser, getUserById} = require('../controllers/HomeController');
const {userSchema} = require("../validators/user.schema");

router.get('/users', getUsers);
router.get('/users/:id', getUserById);

router.post('/users',validate(userSchema) , upsertUser);
router.put('/users/:id',validate(userSchema) , upsertUser);

router.delete('/users/:id', deleteUser);


module.exports=router;