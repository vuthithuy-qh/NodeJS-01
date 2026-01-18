const jwt = require('jsonwebtoken')

const middlewareController = {

    verifyToken: (req, res, next) => {
        const token = req.headers.token;

        if(token){
            //Bearer 123455dvd6
            const accessToken = token.split(" ")[1];

            jwt.verify(accessToken, process.env.MY_SECRET_KEY, (err, user) =>{
                if(err){
                    return res.status(403).json("Token is not valid");
                }

                req.user = user;

                next();
            });
        }else {
            return  res.status(401).json("You are not authenticated");
        }
    },

    verifyTokenAndAdminAuth: (req, res, next) => {
        middlewareController.verifyToken(req, res, () =>{
            if(req.user.id == req.params.id || req.user.admin){
                return next();
            } else {
               return  res.status(403).json("You are not allowed to do that");
            }
        })
    }
}

module.exports = middlewareController;