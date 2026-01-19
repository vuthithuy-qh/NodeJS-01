class ApiError extends Error {
    constructor(statusCode, message, errorCode) {
        super(message);
        this.statusCode = statusCode;
        this.name = "ApiError";
        this.errorCode = errorCode;

        Error.captureStackTrace(this, this.constructor);
    }
}

module.exports = ApiError;
