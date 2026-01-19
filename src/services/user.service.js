const userRepo = require('../repository/user.repository')
const AppError = require('../utils/ApiError');
const User = require('../models/User');
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

const getUserWithPagination = async (filter, pagnination) => {
    const  { skip, limit } = pagnination;

    const total = await User.countDocuments(filter);

    const users = await User.find(filter)
        .select("-password -refreshTokens") //Loại bỏ trường password và refreshTokens khỏi kết quả trả về
        .skip(skip) //Bỏ qua bao nhiêu bản ghi đầu tiên
        .limit(limit) //Giới hạn số document trả về
        .sort({createdAt: -1});//giảm dần (mới → cũ)

    return {
        users, total
    };

}

const getAllUsersForAdmin = async (pagination) => {
    const {skip, limit} = pagination;

    const total = await User.countDocuments();

    const users = await User.find()
        .select('-password -refreshTokens')
        .skip(skip)
        .limit(limit)
        .sort({createdAt: -1});

    return {
        users, total
    };
}

const getPublishUsers = async (pagination) => {
    const {skip, limit} = pagination;

    const filter = {isDeleted: false};

    const total = await User.countDocuments(filter);

    const users = await User.find(filter)
        .select('_id username createdAt')
        .skip(skip)
        .limit(limit)
        .sort({createdAt: -1});

    return {users, total};
}
module.exports = {
    getAllUsers,
    getUserById,
    upsertUser,
    deleteUser,
    getUserWithPagination,
    getPublishUsers,
    getAllUsersForAdmin
}