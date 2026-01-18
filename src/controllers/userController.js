const User = require('../models/User')
const {findById} = require("../repository/user.repository");

const userController = {

    getAllUser: async (req, res) => {

        try{

            const user = await User.find();

            res.status(200).json(user);

        }catch (err){
            res.status(500).json(err);
        }
    },

    //gia chuc nang xoa user
    deleteUser: async (req, res) => {
        try {
            const user = await User.findById(req.params.id);
            res.status(200).json("Delete successfully");
        }catch (error){
            res.status(500).json(err);
        }
    }
}


module.exports = userController;