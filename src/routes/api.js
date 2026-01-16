const express = require('express');
const router = express.Router();

const {postUpsertUser, getUsers, deleteUser, getUserBy} = require('../controllers/HomeController');

router.post('/users', postUpsertUser);

router.get('/users', getUsers);

router.delete('/users/:id', deleteUser);

router.get('/users/:id', getUserBy);

module.exports=router;