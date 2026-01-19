const {StatusCodes} = require('http-status-codes')

const {env} = require('../config/enviroment')

const errorHandlingMiddleware = (err, req, res, next) => {
    if(!err.statusCode) err.statusCode = StatusCodes.INTERNAL_SERVER_ERROR;

    const responseError = {
        statusCode: err.statusCode,
        message: err.message || StatusCodes[err.statusCode],
        stack: err.stack
    }

    console.log('BUILD_MODE: ', env.BUILD_MODE)

    if(env.BUILD_MODE != 'development'){
        delete responseError.stack;
    }

    res.status(responseError.statusCode).json(responseError)
}

module.exports = errorHandlingMiddleware;
