const jwt = require('jsonwebtoken')
const redisClient = require('../config/redis');

const  generateAccessToken = (user) =>{
    return jwt.sign(
        {id: user.id, admin: user.admin},
                process.env.MY_SECRET_KEY,
        {expiresIn: '15m'}
    );
};

const generateRefreshToken = (user) =>{
    return jwt.sign(
        {id: user.id, admin: user.admin},
                process.env.JWT_REFRESH_TOKEN,
        {expiresIn: '15d'}
    );
};

const verifyAccessToken = (token) =>{
    return jwt.verify(token, process.env.MY_SECRET_KEY);
}

const verifyRefreshToken = (token) => {
    return jwt.verify(token, process.env.JWT_REFRESH_TOKEN);
};

const saveRefreshToken = async (userId, token) => {
    const expireTime = 7 * 24* 60 *60;
    const key = `refreshToken:${userId}:${token}`;

    await redisClient.setEx(key, expireTime, JSON.stringify({
        userId, token, createdAt: Date.now()
    }));
};

const deleteRefreshToken = async (userId, token) =>{
    const key = `refreshToken:${userId}:${token}`;
    await redisClient.del(key);
}

const getRefreshToken = async (userId, token) => {
    const key = `refreshToken:${userId}:${token}`;
    const data = await redisClient.get(key);
    return data ? JSON.parse(data) : null;
}

//Xoa tat ca refresh token cu user (logout all device)
const deleteAllRefreshTokens = async (userId) =>{
    const pattern = `refreshToken:${userId}:*`;
    const keys = await redisClient.keys(pattern);

    if(keys.length > 0){
        await redisClient.del(keys);
    }
}


module.exports = {
    generateAccessToken, generateRefreshToken, verifyAccessToken,
    verifyRefreshToken, saveRefreshToken, deleteRefreshToken,
    getRefreshToken, deleteAllRefreshTokens
}