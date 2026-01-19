const jwt = require('jsonwebtoken')

const  generateAccessToken = (user) =>{
    return jwt.sign(
        {id: user.id, admin: user.admin},
                process.env.MY_SECRET_KEY,
        {expiresIn: '15d'}
    );
};

const generateRefreshToken = (user) =>{
    return jwt.sign(
        {id: user.id, admin: user.admin},
                process.env.JWT_REFRESH_TOKEN,
        {expiresIn: '365d'}
    );
};


module.exports = {
    generateAccessToken, generateRefreshToken
}