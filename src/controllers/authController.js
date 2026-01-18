const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const User = require("../models/User");
const userService = require("../services/user.service");
const http = require("node:http");

let refreshTokens = [];
const authController = {
  //REGISTER
  registerUser: async (req, res) => {
    try {
      const salt = await bcrypt.genSalt(10);
      const hashed = await bcrypt.hash(req.body.password, salt);

      //create new user
      const newUser = await new User({
        username: req.body.username,
        email: req.body.email,
        password: hashed,
      });

      //save user
      const user = await newUser.save();

      res.status(200).json(user);
    } catch (err) {
      res.status(500).json(err);
    }
  },

  //generate access token
  generateAccessToken: (user) => {
    return jwt.sign(
      {
        id: user.id,
        admin: user.admin,
      },
      process.env.MY_SECRET_KEY,
      { expiresIn: "20s" },
    );
  },

  //generate refresh token
  generateRefreshRoken: (user) => {
    return jwt.sign(
      {
        id: user.id,
        admin: user.admin,
      },
      process.env.JWT_REFRESH_TOKEN,
      { expiresIn: "365d" },
    );
  },

  //login
  loginUser: async (req, res) => {
    try {
      const user = await User.findOne({ username: req.body.username });
      if (!user) {
        return res.status(404).json("Wrong username");
      }
      const validPassword = await bcrypt.compare(
        req.body.password,
        user.password,
      );
      if (!validPassword) {
        return res.status(404).json("Wrong password");
      }
      if (user && validPassword) {
        const accessToken = authController.generateAccessToken(user);
        const refreshToken = authController.generateRefreshRoken(user);
        refreshTokens.push(refreshToken); // giong kieu luu tam thoi, nen luu vao db
        //luu refresh token vao cookie
        res.cookie("refreshToken", refreshToken, {
          httpOnly: true,
          secure: false,
          path: "/",
          sameSite: "strict",
        });

        //xuat ra ngoai khong can password
        const { password, ...others } = user._doc;
        res.status(200).json({ ...others, accessToken });
      }
    } catch (error) {
      console.log(error);
      res.status(500).json(error);
    }
  },

    //redis luu refresh token
  requestRefreshToken: async (req, res) => {
    //take refresh token from user
    const refreshToken = req.cookies.refreshToken;
    if(!refreshToken) return res.status(401).json("You are not authenticated");

    if(!refreshTokens.includes(refreshToken)){
        return res.status(403).json("Refresh token is not valid");
    }
    jwt.verify(refreshToken, process.env.JWT_REFRESH_TOKEN, (err, user) =>{
        if(err){
            console.log(err);
        }

        refreshTokens = refreshTokens.filter((token) => { token !== refreshToken})

        //create new access token, refresh token

        const newAccessToken = authController.generateAccessToken(user);

        const newRefreshToken = authController.generateRefreshRoken(user);

        refreshTokens.push(newRefreshToken);

        res.cookie("refreshToken", newRefreshToken, {
            httpOnly: true,
            secure: false,
            path:"/",
            sameSite : "strict",
        });

        res.status(200).json({accessToken: newAccessToken});
    });

  },

    userLogout: async (req, res)=>{
      res.clearCookie("refreshToken");
      refreshTokens = refreshTokens.filter(token => token !== req.cookies.refreshToken);
      res.status(200).json("Logged out successfully");
    }
};

//store token
//1) local storage
// de bi tan cong XSS
//2) http only cookie
// de bi tan cong CSRF -> dc khac phuc bang cach su dung sameSite attribute
//3) Redux store de luu access token
// htpp only cookie de luu refresh token

//bff PATTERN (BACKEND FOR FRONTEND)

module.exports = authController;
