const Joi = require('joi');

const userSchema = Joi.object({
    id: Joi.number().integer().positive().optional(),

    email: Joi.string()
        .email()
        .required()
        .messages({
            'string.email': 'Invalid email format',
            'any.required': 'Email is required'
        }),

    name: Joi.string()
        .min(2)
        .max(50)
        .pattern(/^[a-zA-ZÀ-ỹ\s]+$/)
        .required()
        .messages({
            'string.pattern.base': 'Name must contain only letters and spaces',
            'any.required': 'Name is required'
        }),

    city: Joi.string()
        .min(2)
        .pattern(/^[a-zA-ZÀ-ỹ\s]+$/)
        .required()
        .messages({
            'string.pattern.base': 'City must contain only letters and spaces',
            'any.required': 'City is required'
        })
});

module.exports = {userSchema};
