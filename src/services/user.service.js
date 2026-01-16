const userRepo = require('../repository/user.repository')
const AppError = require('../utils/appError');

const getAllUsers = async () =>{
    return await userRepo.findAll();
}

const getUserById = async (id) =>{
    const user = await userRepo.findById(id);

    if(!user){
        throw new AppError('User not found', 404);
    }

    return user;
}

const upsertUser = async ({id, email, name, city}) => {
    if(id) {
        const parsedId = Number(id);
        if (!Number.isInteger(parsedId) || parsedId <= 0) {
            throw new AppError('Invalid user id', 400);
        }

        const updated = await userRepo.updateById(parsedId, {email, name, city});

        if(!updated){
            throw new AppError('User not found', 404);
        }

        return {
            id: parsedId,
            email,
            name,
            city
        };
    }

    const createdUser = await userRepo.create({
        email, name, city
    });

    return createdUser;
}



const deleteUser = async (id) => {
    const affected = await userRepo.deleteById(id);
    if(affected === 0) {
        throw new AppError('User not found', 404);
    }
}

module.exports = {
    getAllUsers,
    getUserById,
    upsertUser,
    deleteUser
}