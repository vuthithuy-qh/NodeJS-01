module.exports = (err, req, res, next) => {
    if (err.isOperational) {
        return res.status(err.statusCode).json({
            errorCode: err.statusCode,
            message: err.message
        });
    }


    res.status(err.statusCode || 500).json({
        errorCode: err.errorCode || -1,
        message: err.message || 'Internal server error'
    });

};