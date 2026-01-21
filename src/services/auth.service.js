const bcrypt = require('bcrypt');
const User = require('../models/User');
const ApiError = require('../utils/ApiError');
const tokenService = require('./token.service')
const jwt = require('jsonwebtoken');
const {StatusCodes} = require("http-status-codes");


const registerUser = async ({username, email, password}) => {
    const existed = await User.findOne({username});
    if(existed) throw new ApiError(409, "Username already exists");

    const salt = await bcrypt.genSalt(10);
    const hashed = await bcrypt.hash(password, salt);

    const user = await User.create({
        username,
        email,
        password: hashed
    });

    // await user.save();

    return user;
};


const loginUser = async ({username, password}) => {
    const user = await User.findOne({username});
    if(!user) throw new ApiError(404, 'Wrong username');

    const valid = await bcrypt.compare(password, user.password);

    if(!valid) {
        throw new ApiError(StatusCodes.UNAUTHORIZED, 'Wrong password');
    }

    const accessToken = tokenService.generateAccessToken(user);
    const refreshToken = tokenService.generateRefreshToken(user);

    // Lưu refresh token vao redis
    await tokenService.saveRefreshToken(user._id.toString(), refreshToken);


    // await user.save();

    return {
        user: {
            id: user._id,
            username: user.username,
            email: user.email,
            role: user.admin ? 'admin' : 'user'
        },
        tokens : {
            accessToken,
            refreshToken
        }
    }
};

const refreshToken = async (req, res) =>{
    const oldRefreshToken = req.cookies.refreshToken;

    if(!oldRefreshToken) throw new ApiError(401, 'You are not authenticated');

    try{
        const decoded = tokenService.verifyRefreshToken(oldRefreshToken)

        const tokenExists = await tokenService.getRefreshToken(
            decoded.id.toString(),
            oldRefreshToken
        )

        if(!tokenExists){
            throw new ApiError(403, 'Refresh token is expired or invalid');
        }

        const user = await User.findById(decoded.id);
        if(!user){
            throw new ApiError(404, 'User not found');
        }

       //xoa token cu tu redis
        await tokenService.deleteRefreshToken(decoded.id.toString(), oldRefreshToken);

        //Tao token moi
        const newAccessToken = tokenService.generateAccessToken(user);
        const newRefreshToken = tokenService.generateRefreshToken(user);

        //luu token moi vao redis
        await tokenService.saveRefreshToken(decoded.id.toString(), newRefreshToken);
        //gui refresh token moi ve client
        res.cookie('refreshToken', newRefreshToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            path: '/'
        });

        return { accessToken: newAccessToken };


    }catch (err) {
        throw new ApiError(403, 'Refresh token is expired or invalid');
    }


    //Trong cơ chế bảo mật JWT, khi người dùng dùng một
    // Refresh Token để đổi lấy Access
    // Token mới, lập tức Refresh Token cũ đó nên bị hủy bỏ
    // (thu hồi) để tránh bị kẻ xấu lấy trộm và dùng lại nhiều lần
}


const logout = async (req, res) => {
    const refreshToken = req.cookies.refreshToken;

    if(! refreshToken) {
        throw new ApiError(401, 'You are not authenticated');
    }

   try {
       const decoded = tokenService.verifyRefreshToken(refreshToken);

       //kiem tra token co trong redis ko
       const tokenExists = await tokenService.getRefreshToken(decoded.id.toString(), refreshToken);

       if(!tokenExists) {
           throw new ApiError(403, 'Refresh token is expired or invalid');
       }

       //Xoa refresh token khoi redis
       await tokenService.deleteRefreshToken(decoded.id.toString(), refreshToken);
       console.log(`User ${decoded.id.toString()} logged out successfully`);

   }catch (err) {
         //ignore error vi token da het han
       console.error("Logout error: ", err.message);
       throw new ApiError(403, 'Logout failed - Invalid or expired token' )

   }

   res.clearCookie('refreshToken');
};

//logout all devices

const logoutAllDevices = async (userId) => {
    await tokenService.deleteAllRefreshTokens(userId.toString());
}

module.exports = {
    registerUser,
    loginUser,
    refreshToken,
    logout,
    logoutAllDevices
}
