const asyncHandler = require("../middleware/asynHandler");
const AppError = require('../utils/ApiError');

const {findAllUsers, findUserById, softDeleteUserById} = require('../repository/user.repository');
const {respond} = require("../utils/responseHandler");

const userController = {
    getAllUser: asyncHandler(async (req, res) => {
        const isAdmin = req.user?.admin;

        const users = await findAllUsers(isAdmin);

        respond(res, 200, users);

    }),

    deleteUser: asyncHandler(async (req, res, next) => {
        const {id} = req.params;

        const user = await findUserById(id);

        if(!user) {
            return next(new AppError('User not found', 404));
        }

        if(user.isDeleted){
            return next(new AppError('User already deleted', 400));
        }

        await softDeleteUserById(id);

        respond(res, 200, {message: 'User soft deleted successfully'});
    }
    )
}


module.exports = userController;