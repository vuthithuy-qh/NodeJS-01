const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const authRoute = require('./routes/auth');
require('dotenv').config();

const userRoute = require('./routes/user');


const connectDB = require('./config/database');

const app = express();
const port = process.env.PORT || 8081;

// connect mongodb
connectDB();

// middlewares
app.use(cors());
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// routes
app.use('/v1/api', require('./routes/api'));
app.use('/v1/auth', require('./routes/auth'));
app.use('/v1/users/', require('./routes/user'));

// error handler
app.use(require('./middleware/errorHandler'));

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
