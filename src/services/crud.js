const connection = require("../config/database");

const getAllUsers = async () =>{

    try {
        let [results, fields] = await connection.query(`select *
                                                        from Users`);

        return results;
    }catch(error){
        console.log(">>> check error: ", error);
        throw new Error(error);
    }
}

const getUserById= async (userId)=>{

    try {
        let[results, fields] = await connection.query(`select * from Users where id = ?`, [userId]);
        let user = results && results.length > 0 ? results[0] : {};
        return user;
    }catch (error){
        console.log(">>> check error: ", error);
        throw new Error(error);
    }
}

const updateUserById = async (email, name, city, userId) =>{
   try {
       let [results, fields] = await connection.query(
           `update Users set email = ?, name = ?, city = ? where id = ?`,
           [email, name, city, userId]
       );
       return results;
   }catch (error){
         console.log(">>> check error: ", error);
         throw new Error(error);
   }

}

const createUser = async (email, name, city) =>{

    try {
        let [results, fields] = await connection.query(
            `insert into Users (email, name, city) values (?, ?, ?)`,
            [email, name, city]
        );
        return results;
    }catch (error) {
        console.log(">>> Error createUser:", error);
        throw new Error(error);
    }
}

const removeUserById = async (userId) =>{
    try {
        let [results, fields] = await connection.query(
            `delete from Users where id = ?`, [userId]
        );
        return results.affectedRows > 0;

        return results.affectedRows > 0;
    }catch (error){
        console.log(">>> check error: ", error);
        throw new Error(error);
    }

}
module.exports =
    {
        getAllUsers, getUserById, updateUserById, removeUserById, createUser
    }