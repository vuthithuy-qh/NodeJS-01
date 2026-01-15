const connection = require("../config/database");

const getAllUsers = async () =>{
    let [results, fields] = await connection.query(`select * from Users`);

    return results;
}

const getUserById = async (userId)=>{
    let[results, fields] = await connection.query(`select * from Users where id = ?`, [userId])

    let user = results && results.length > 0 ? results[0] : {};
    return user;
}

const updateUserById = async (email, name, city, userId) =>{
    let [results, fields] = await connection.query(
        `update Users set email = ?, name = ?, city = ? where id = ?`,
        [email, name, city, userId]
    );
}

const removeUserById = async (userId) =>{
    let [result , fields] = await connection.query(
        `delete from Users where id = ?`, [userId]
    )
    return (result.affectedRows > 0);
}
module.exports =
    {
        getAllUsers, getUserById, updateUserById, removeUserById
    }