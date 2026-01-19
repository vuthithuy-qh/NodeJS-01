const jwt = require("jsonwebtoken");
const ApiError = require("../utils/ApiError");
const {createNullProtoObjWherePossible} = require("ejs/lib/utils");

const verifyToken = (req, res, next) => {
    const authHeader = req.headers.authorization;

    if(!authHeader) {
        throw new ApiError(401, "Authorization header missing");
    }

    const parts = authHeader.split(" ");

    if(parts.length !== 2 || parts[0] !== "Bearer") {
        throw new ApiError(401, "Invalid authorization header format");
    }

    const token = parts[1];

    jwt.verify(token, process.env.MY_SECRET_KEY, (err, decoded) => {
        if(err) {
            throw new ApiError(403, "Invalid or expired token");
        }
        //poyload tu jwt
        req.user = decoded

        next();
    })
}

const verifyAdmin = (req, res, next) => {
    if(!req.user.admin) {
        throw new ApiError(403, "Admin privileges required");
    }

    next();
}

const verifyOwnerOrAdmin = (req, res, next) =>{
    const userIdFromToken = req.user.id;
    const userIdFromParams = req.params.userId;
    if(userIdFromToken !== userIdFromParams && !req.user.admin){
        throw new ApiError(403, "Access denied. Not owner or admin");
    }
    next();
};

module.exports = {
    verifyToken,
    verifyAdmin,
    verifyOwnerOrAdmin
};
