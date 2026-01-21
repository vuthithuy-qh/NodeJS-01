const {StatusCodes} = require('http-status-codes')
const {respond} = require("../utils/responseHandler");
const ApiError = require('../utils/ApiError');
const notFound = (req, res, next) => {
    next(
        new ApiError(StatusCodes.NOT_FOUND, `Route ${req.originalUrl} not found`)
    );
};

module.exports = notFound;