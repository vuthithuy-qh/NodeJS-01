require("dotenv").config();

const env = {
    MONGODB_URI: process.env.MONGODB_URI,

    HOST_NAME: process.env.HOST_NAME,
    PORT: Number(process.env.PORT),

    DB_HOST: process.env.DB_HOST,
    DB_PORT: Number(process.env.DB_PORT),
    DB_USER: process.env.DB_USER,
    DB_PASSWORD: process.env.DB_PASSWORD,
    DB_NAME: process.env.DB_NAME,

    JWT_SECRET_KEY: process.env.MY_SECRET_KEY,
    JWT_REFRESH_TOKEN: process.env.JWT_REFRESH_TOKEN,


    NODE_ENV: process.env.NODE_ENV,
    BUILD_MODE: process.env.BUILD_MODE,

};


module.exports = {env};
