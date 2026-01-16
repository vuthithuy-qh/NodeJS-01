const Joi = require('joi');
const AppError = require('../utils/AppError');

// dinh nghia schema
// const userSchema = Joi.object({
//     id: Joi.number().integer().positive().optional(),
//     email: Joi.string().email().required().message({
//         'string.email' : 'Invalid email format'
//     }),
//     name: Joi.string().min(2).max(50).pattern(new RegExp('^[a-zA-ZÀ-ỹ\\\\s]+$'))
//         .required().message({'string.pattern.base': 'Name must contain only letters and spaces'}),
//     city: Joi.string().min(2).pattern(new RegExp('^[a-zA-ZÀ-ỹ\\s]+$')).required()
//
// })


const validateUpsertUser = (req, res, next) => {

    const {email, name, city, id} = req.body;

    const errors = [];

    if(id !== undefined){
        const parsedId = Number(id);

        if(!Number.isInteger(parsedId) || parsedId <= 0){
            errors.push("ID must be a positive integer.");
        }else {
            req.body.id = parsedId;
        }
    }

    if (!email || typeof email !== 'string' || !email.trim()) {
        errors.push('Invalid email');
    }

    if (!name || typeof name !== 'string' || !name.trim()) {
        errors.push('Invalid name');
    }

    if (!city || typeof city !== 'string' || !city.trim()) {
        errors.push('Invalid city');
    }

    if (errors.length > 0) {
        throw new AppError(errors.join(', '), 400, 1);
    }

    next();
};

module.exports = {validateUpsertUser};