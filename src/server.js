const express = require('express')
const path = require('path');
require('dotenv').config()
const  configViewEngine = require('./config/viewEngine');
const connection = require('./config/database');

// import express from 'express'
const app = express();

const port = process.env.PORT|| 8081 ;
const hostname = process.env.HOST_NAME;

configViewEngine(app);
//config req.
app.use(express.json()); //for json
app.use(express.urlencoded({extended: true})) // for form data


const webRouter = require('./routes/web');


// khai bao route
app.use('/', webRouter);





app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})
