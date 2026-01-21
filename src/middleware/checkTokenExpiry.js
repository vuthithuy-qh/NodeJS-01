const tokenService = require('../services/token.service')

const ApiError = require('../utils/ApiError');

const checkTokenExpiry = (req, res, next) => {
    const token = req.headers.authorization?.split(' ')[1];

    if(!token) {
        return next();
    }

    try {
        const decoded = tokenService.verifyAccessToken(token);

        const expiresIn = decoded.exp - Math.floor(Date.now() / 1000);

        if(expiresIn > 10 * 60) {
            throw new ApiError(400, `Token still valid for ${expiresIn} seconds`);
        }

        next();
    }catch (err){
        next();
    }
}

module.exports = {checkTokenExpiry}