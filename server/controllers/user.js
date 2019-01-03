const User = require("../models/user");
const jwt = require("jsonwebtoken");
const config = require("../config/dev");

// register
exports.register = async function(req, res, next) {
    try {
        const {id, password} = req.body;

        await User.create({
            id,
            password
        });

        // jwt to header
        const token = jwt.sign({
            // dummy data for now
            "name": "John Doe"
        }, config.JWT_KEY, {expiresIn: "1h"});

        return res.json({
            token
        });
    } catch(error) {
        if(error.code === 11000) {
            error.message = "The entered ID already exists."
        }
        return next({
            status: 400,
            message: error.message
        });
    }
};

exports.authenticate = async function(req, res, next) {
    try {
        let user = await User.findOne({id: req.body.id});
        
        //check password matches
        let isMatch = await user.comparePassword(req.body.password);
        
        if(isMatch) {
            const token = jwt.sign({
                // dummy data for now
                name: "John Doe"
            }, config.JWT_KEY, {expiresIn: "1h"});

            return res.json({
                token
            });
        } else {
            return next({
                status: 400,
                message: "Wrong ID or password."
            })
        }
    } catch(error) {
        return next({
            status: 400,
            message: "Wrong ID or password."
        });
    }
};