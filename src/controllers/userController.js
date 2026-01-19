const asyncHandler = require("../middleware/asynHandler");
const AppError = require('../utils/ApiError');

const {findAllUsers, findUserById, softDeleteUserById} = require('../repository/user.repository');
const {respond} = require("../utils/responseHandler");
const userService = require("../services/user.service")
const {StatusCodes} = require("http-status-codes");


const userController = {
    getAllUsersForAdmin: asyncHandler(async (req, res) => {
        const {page, page_size} = req.pagination;


        const {users, total} = await userService.getAllUsersForAdmin( req.pagination);

        respond(res, StatusCodes.OK, {
            data: users, page, page_size, total_page: Math.ceil(total/page_size)
        })

    }),

    getPublishUsers: asyncHandler(async (req, res) => {
        const {page, page_size} = req.pagination;
        const {users, total} = await userService.getPublishUsers(req.pagination);

        respond(res, StatusCodes.OK, {
            data: users, page, page_size, total_page: Math.ceil(total / page_size)

        })
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