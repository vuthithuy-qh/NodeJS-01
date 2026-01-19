const Joi = require('joi');

const {StatusCodes} = require('http-status-codes');

const ApiError = require('../utils/ApiError')

const register = async (req, res, next) => {

    const correctCondition = Joi.object({
        username: Joi.string()
            .min(6)
            .max(20)
            .required()
            .trim()
            .strict()
            .message({
                "string.base" : `"Username must be a string`,
                "string.empty": `"Username" is not allowed to be empty`,
                "string.min": `"Username" must be at least {#limit} characters`,
                "string.max": `"Username" must be at most {#limit} characters`,
                "any.required": `"Username" is required`,
            }),

        email : Joi.string()
            .email()
            .min(10)
            .max(50)
            .required()
            .trim()
            .strict()
            .message({
                "string.email": `"Email" must be a valid email`,
                "string.empty": `"Email" is not allowed to be empty`,
                "any.required": `"Email" is required`,
            }),

        password: Joi.string()
            .min(6)
            .required()
            .trim()
            .message({
                "string.min": `"Password" must be at least {#limit} characters`,
                "any.required": `"Password" is required`,
            }),
    });

    try {
        await correctCondition.validateAsync(req.body, {
            abortEarly: false
        });

        next();
    }catch (error) {
        const errorMessages = new Error(error).message;
        const customError = new ApiError(StatusCodes.UNPROCESSABLE_ENTITY, errorMessages);

        next(customError);
    }
};

module.exports = {
    register
};