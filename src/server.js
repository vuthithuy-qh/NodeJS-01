const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
require('dotenv').config();
const errorHandlingMiddleware = require('./middleware/errorHandler');
const notFound = require('./middleware/notFound.middleware');


const connectDB = require('./config/database');

const app = express();
const port = process.env.PORT || 8081;

// connect mongodb


// middlewares
app.use(cors());
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// routes
app.use('/v1/auth', require('./routes/auth'));
app.use('/v1/users/', require('./routes/user'));
app.use('/v1/admin/', require('./routes/admin'));



app.use(notFound);
//middleware xu li loi
app.use(errorHandlingMiddleware);


const startServer = async () => {
    try {
        await connectDB();

        app.listen(port, () => {
            console.log(`🚀 Server running on port ${port}`);
        });
    } catch (err) {
        console.error("❌ Server start failed:", err.message);
    }
};

startServer();
