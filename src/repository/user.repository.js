const User = require('../models/User')

const findAllUsers = (isAdmin) => {
    if(isAdmin){
        return User.find();
    }

    return User.find({isDeleted: false});

};

const findUserById = (id) => {
    return User.findById(id);
}

const softDeleteUserById = (id) => {
    return User.findByIdAndUpdate(id, {isDeleted: true}, {new: true});
}

module.exports = {
    findAllUsers,
    findUserById,
    softDeleteUserById
};