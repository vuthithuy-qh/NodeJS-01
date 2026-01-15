const connection = require('../config/database');
const {raw} = require("express");
const {getAllUsers, getUserById, updateUserById, removeUserById} = require('../services/crud');

const getHomePage= async (req, res) => {

    let results = await getAllUsers();
    return res.render('home.ejs', {listUsers: results});

}

const postCreateUser = async (req,res) =>{

    let  email = req.body.email;
    let name = req.body.name;
    let city = req.body.city;

   // let {email, name, city} = req.body;
    console.log(">>> Check data from client: ", email, name, city);


    let [results, fields] = await connection.query(
        `insert into Users (email, name, city) values (?,?,?)`,[email, name, city]
    );

    console.log(">>> Inserted data successfully:", results);
    res.send("Create user successfully!");
}

const getCreatePage = (req, res) => {

    return res.render('create.ejs');
}

const getUpdatePage = async (req, res) => {
    const  userId = req.params.id;

    let user = await getUserById(userId)
    return res.render('edit.ejs', {userEdit : user});
}

const postUpdateUser = async (req,res) =>{

    let  email = req.body.email;
    let name = req.body.name;
    let city = req.body.city;
    let userId = req.body.id;

   await updateUserById(email, name, city, userId);

    res.redirect('/');
}

const postDeleteUser = async (req, res) =>{

    const  userId = req.params.id;

    let user = await getUserById(userId)
    res.render('delete.ejs', {userEdit: user});
}


const postHandleRemoveUser = async (req, res) =>{
    const userId = req.body.id;

    const isDelete = removeUserById(userId);

    if(isDelete){
        return res.redirect('/');
    }
    else {
        return res.send('User not found');
    }

}
module.exports = {
    getHomePage, postCreateUser,
    getCreatePage, getUpdatePage, postUpdateUser,
    postDeleteUser, postHandleRemoveUser
}