const userRepo = require('../repository/user.repository')
const AppError = require('../utils/ApiError');

const getAllUsers = async () =>{
    return await userRepo.findAll();
}

const getUserById = async (id) =>{
    const user = await userRepo.findById(id);

    if(!user){
        throw new AppError(404, 'User not found');
    }

    return user;
}

const upsertUser = async ({id, email, name, city}) => {
    if(id) {
        const parsedId = Number(id);
        if (!Number.isInteger(parsedId) || parsedId <= 0) {
            throw new AppError(400, 'Invalid user id');
        }

        const updated = await userRepo.updateById(parsedId, {email, name, city});

        if(!updated){
            throw new AppError(404, 'User not found');
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
        throw new AppError(404, 'User not found');
    }
}

module.exports = {
    getAllUsers,
    getUserById,
    upsertUser,
    deleteUser
}