const connection = require('../config/database');
const {raw} = require("express");
const {getAllUsers, getUserById, updateUserById, removeUserById, createUser} = require('../services/crud');

const getUsers= async (req, res) => {

    try{
        let results = await getAllUsers();

        return res.status(200).json({
            errorCodes: 0,
            data: results
        });
    }catch (error){
        return res.status(500).json({
            message : "Error"
        })
    }

}

const postUpsertUser = async (req,res) =>{
    let {email, name, city, id} = req.body;

    if(!email || !name || !city){
        return res.status(400).json({
            message: "Missing required parameters"
        });
    }

    try{
        if(id){
            let results =  await updateUserById(email, name,city, id);

            if(results && results.affectedRows > 0) {
                return res.status(200).json({
                    message: "User updated successfully",
                    data: {id, email, name, city}
                });
            }else {
                return res.status(404).json({
                    message: "User Id doest not exist. Update failed"
                })
            }
        }else {
            let result = await createUser(email, name, city);
            return res.status(201).json({
                message: "User created successfully",
                data: result
            });
        }
    }catch (error){
        console.log(error)
        return res.status(500).json({
            message : "error saving user"
        });
    }


}


const deleteUser = async (req, res) => {
    const userId = req.params.id;

    try {
        const isDeleted = await removeUserById(userId);

        if(isDeleted){
            return res.status(200).json({
                errorCodes: 0,
                message: "User deleted successfully"
            })
        }else {
            return res.status(404).json({
                errorCodes: 2,
                message: "User not found"
            })
        }
    }catch (error) {
        return res.status(500).json({
            errorCodes: -1,
            message : "Error deleting user"
        })

    }
}

const getUserBy= async (req, res) =>{
    const userId = req.params.id;
    try {
        let user = await getUserById(userId);

        if(user && Object.keys(user).length > 0){
            return res.status(200).json({
                errorCodes: 0,
                data: user
            })
        }else {
            return res.status(404).json({
                errorCodes: 2,
                message: "User not found"
            })
        }
    }catch (error) {
        return res.status(500).json({
            errorCodes: -1,
            message : "Error retrieving user"
        })
    }
}


module.exports = {
    getUsers, postUpsertUser, deleteUser,getUserBy

}