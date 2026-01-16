
const AppError = require('../utils/AppError');




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

const validate = (schema, property = 'body') => {
    return (req, res, next) => {
        const {error, value} = schema.validate(req[property], {
            abortEarly: false
        });

        if (error) {
            return res.status(400).json({
                errorCode: 1,
                message: error.details.map(e => e.message)
            });
        }

        req[property] = value;
        next();
    }
}

module.exports = {validateUpsertUser, validate};