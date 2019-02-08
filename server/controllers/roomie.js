const Roomie = require("../models/roomie");
const Region = require("../models/region");
const User = require("../models/user");
const config = require("../config/dev");
const jwt = require("jsonwebtoken");

// INDEX route - api/roomie
exports.getRoomies = async function(req, res, next) {
    try {
        let roomies = await Roomie.find({}).populate("region").limit(3);
        return res.status(200).json(roomies);
    } catch(error) {
        return next({
            status: 400,
            message: "Something gone wrong in getting roomie datas."
        })
    }
};


// SHOW route - api/roomie/:id
exports.selectRoomie = async function(req, res, next) {
    try {
        let roomie = await Roomie.findById(req.params.id);
        if(roomie == null) {
            throw Error;
        }
        return res.status(200).json({roomie});
    } catch(error) {
        return next({
            status: 400,
            message: "Cannot find the requested roomie."
        });
    }
};

// CREATE route - api/roomie
exports.createRoomie = async function(req, res, next) {
    try {
        let {
            phoneNumber, 
            region, 
            minBudget, 
            maxBudget
        } = req.body;

        let profileImage = "uploads/avatar-default.png";
        if(req.file) {
            profileImage = req.file.path;
        }

        let user = await User.findById(res.locals.userId);

        region = await findRegion(region);

        let roomie = new Roomie({
            phoneNumber, 
            region, 
            minBudget, 
            maxBudget,
            profileImage,
            name: user.firstName + " " + user.lastName
        });

        if(user.roomie) {
            throw new Error("Roomie data already exists for this user!");
        }
        
        await roomie.save();
        user.roomie = roomie;
        await user.save();

        const token = jwt.sign({
            userId: user._id,
            roomie: roomie,
            firstName: user.firstName,
            lastName: user.lastName
        }, config.JWT_KEY, {expiresIn: "1h"});

        return res.json({
            token,
            userId: user._id,
            firstName: user.firstName,
            lastName: user.lastName,
            roomie
        });
        
        //return res.status(200).json(roomie);

    } catch(error) {
        return next({
            status: 400,
            message: error.message
        });
    }
};

// UPDATE route - api/roomie/:id
exports.updateRoomie = async function(req, res, next) {
    try {
        await Roomie.findByIdAndUpdate(req.params.id, req.body);
        return res.status(200).json({"update": "success"});
    } catch(error) {
        return next({
            status: 400,
            message: error.message
        });
    }
}

// DELETE route - api/roomie/:id
exports.deleteRoomie = async function(req, res, next) {
    try {
        await Roomie.findById(req.params.id).remove();
        return res.status(200).json({"roomie": "deleted"});
    } catch(error) {
        return next({
            status: 400,
            message: error.message
        })
    }
}

// function to find relational region data
async function findRegion(region) {
    let foundRegion = await Region.findOne({"name": region});
    // create one if one doesnt exist
    if(foundRegion == null) {
        await Region.create({
            name: region
        });
        foundRegion = await Region.findOne({"name": region});
    };
    return foundRegion;
};