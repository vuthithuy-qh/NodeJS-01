
const mongoose = require('mongoose')
const {string, boolean} = require("joi");

const userSchema = new mongoose.Schema(
    {
    username: {
        type: String,
        required: true,
        minlength: 6,
        maxlength: 20,
        unique: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        minlength: 10,
        maxlength: 50,
        unique: true,
        trim: true
    },
    password: {
        type: String,
        required: true,
        minlength: 6
    },
    admin: {
        type: Boolean,
        default: false,
    },
        refreshTokens: {
        type: [String],
        default: []
    }, isDeleted: {
            type: Boolean,
            default: false
        }

},
    {timestamps: true},

)

module.exports = mongoose.model('User', userSchema)