const jwt = require("jsonwebtoken");
const config = require("../config/dev");

exports.loginRequired = async function(req, res, next) {
    try {
        // get jwt from header
        const token = req.headers.authorization.split(" ")[1];
        jwt.verify(token, config.JWT_KEY, function(error, decoded) {
            if(decoded) {
                res.locals.userId = decoded.userId;
                return next();
            } else {
                return next({
                    status: 400,
                    message: "Unauthorized. Please log in first."
                });
            }
        });
    } catch(error) {
        return next({
            status: 400,
            message: "Unauthorized. Please log in first."
        });
    }
};

exports.ensureCorrectuser = async function(req, res, next) {
    try {
        const token = req.headers.authorization.split(" ")[1];
        jwt.verify(token, config.JWT_KEY, function(error, decoded){
            if(decoded && decoded.userId == req.params.id) {
                return next();
            } else {
                return next({status: 401, message: "Unauthorized"});
            }
        })
    } catch(error) {
        return next({
            status: 400,
            message: "Unauthorized. Please log in first."
        });
    }
};