const bcrypt = require('bcrypt');
const User = require('../models/User');
const ApiError = require('../utils/ApiError');
const tokenService = require('./token.service')
const jwt = require('jsonwebtoken');


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

    await user.save();

    return user;
};


const loginUser = async ({username, password}, res) => {
    const user = await User.findOne({username});
    if(!user) throw new ApiError(404, 'Wrong username');

    const valid = await bcrypt.compare(password, user.password);

    const accessToken = tokenService.generateAccessToken(user);
    const refreshToken = tokenService.generateRefreshToken(user);

    user.refreshTokens.push(refreshToken);

    await user.save();

    res.cookie('refreshToken', refreshToken, {
        httpOnly: true,
        secure: false,
        sameSite : 'strict'
    });

    const {password: pw, ...others} = user._doc;
    return {...others, accessToken};
};

const refreshToken = async (req, res) =>{
    const oldRefreshToken = req.cookies.refreshToken;

    if(!oldRefreshToken) throw new ApiError(401, 'You are not authenticated');

    const user = await User.findOne({refreshTokens: oldRefreshToken});
    if(!user){
        throw new ApiError(403, 'Refresh token is not valid');
    }

    try{
        const decoded = jwt.verify(oldRefreshToken, process.env.JWT_REFRESH_TOKEN);

        user.refreshTokens = user.refreshTokens.filter(token => token !== oldRefreshToken);

        const newAccessToken = tokenService.generateAccessToken(user);
        const newRefreshToken = tokenService.generateRefreshToken(user);

        // Lưu token mới vào mảng
        user.refreshTokens.push(newRefreshToken);
        await user.save();

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

    if(!refreshToken) return;

    await User.updateOne(
        {refreshTokens: refreshToken},
        { $pull: { refreshTokens: refreshToken } }
    );

    res.clearCookie('refreshToken');
};

module.exports = {
    registerUser,
    loginUser,
    refreshToken,
    logout
}
