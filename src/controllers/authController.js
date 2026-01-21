const asyncHandler = require("../middleware/asynHandler");
const {respond} = require("../utils/responseHandler");
const authService = require("../services/auth.service");
const {StatusCodes} = require("http-status-codes");
const User = require("../models/User");

const register = asyncHandler(async (req, res) => {
    const user = await authService.registerUser(req.body);
    respond(res, StatusCodes.CREATED, {
        status: "success",
        data: user
    });
});
const login = asyncHandler(async (req, res) => {
    const data = await authService.loginUser(req.body);
    res.cookie('refreshToken', data.tokens.refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'Strict',
    })
    respond(res, StatusCodes.OK, {
        status: "success",
        data: {
            user: data.user,
            accessToken: data.tokens.accessToken
        }

    });
});

const refreshToken = asyncHandler(async (req, res) => {
    const data = await authService.refreshToken(req, res);
    respond(res, StatusCodes.OK, {
        status: "success",
        data: data
    })
});

const logout = asyncHandler(async (req, res) => {
    await authService.logout(req, res);
    respond(res, StatusCodes.OK, {
        status: "success",
        message: "Logged out successfully"
    });

});

const getMe = asyncHandler(async (req, res) => {
    console.log("user: ",req.user);
    const user = await User.findById(req.user.id).select('-password -refreshTokens');
    respond(res, StatusCodes.OK, {
        status: "success",
        data: user
    });
})

module.exports = {
    register, logout, login, refreshToken, getMe
}


