const asyncHandler = require('../middleware/asynHandler')
const userService = require('../services/user.service');
const {respond} = require('../utils/responseHandler');

const getUsers = asyncHandler(async (req, res) => {
    const users = await userService.getAllUsers();
    respond(res, 200, {errorCode: 0, data: users});
});

const getUserById = asyncHandler(async (req, res) =>{
    const user = await  userService.getUserById(Number(req.params.id));
    respond(res, 200, {errorCode: 0, data: user});
})

const upsertUser = asyncHandler(async (req, res) => {
    const user = await userService.upsertUser({
        id: req.params.id,
        ... req.body
    });
    respond(res, 200, {errorCode: 0, data: user});
})

const deleteUser = asyncHandler(async (req, res) =>{
    await userService.deleteUser(Number(req.params.id));
    respond(res, 200, {errorCode: 0, message: 'User deleted successfully'});
});

module.exports = {
    getUsers, getUserById, upsertUser, deleteUser
}