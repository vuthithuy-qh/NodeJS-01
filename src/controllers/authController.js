const asyncHandler = require("../middleware/asynHandler");
const {respond} = require("../utils/responseHandler");
const authService = require("../services/auth.service");

module.exports = {
    register: asyncHandler(async (req, res) => {
        const user = await authService.registerUser(req.body);
        respond(res, 201, user);
    }),
    login: asyncHandler(async (req, res) => {
        const data = await authService.loginUser(req.body, res);
        respond(res, 200, data);
    }),

    refreshToken: asyncHandler(async (req, res)=>{
        await authService.refreshToken(req, res);
    }),

    logout: asyncHandler(async (req, res) => {
        await authService.logout(req, res);
        respond(res, 200, {message: "Logged out successfully"});

    })


}