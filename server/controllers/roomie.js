const Roomie = require("../models/roomie");
const Region = require("../models/region");
const User = require("../models/user");
const Budget = require("../models/budget");
const config = require("../config/dev");
const jwt = require("jsonwebtoken");

// INDEX route - api/roomie
exports.getRoomies = async function(req, res, next) {
    try {
        const region = req.query.region;
        if(region) {
            let foundRegion = await Region.find({name: {"$regex": region}}).populate("roomies");

            foundRoomies = [].concat.apply([],foundRegion.map(region => region.roomies));

            return res.status(200).json(foundRoomies);
        }
        const budget = req.query.budget;
        if(budget) {
            let foundBudget = await Budget.findOne({amount: budget}).populate("roomies");
            return res.status(200).json(foundBudget.roomies);
        }
        
        let roomies = await Roomie.find({}).limit(parseInt(req.query.num));
        //let roomies = await Roomie.aggregate([{$sample: {size: parseInt(req.query.num)}}]);
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
        // check if the user already has the roomie data
        let user = await User.findById(res.locals.userId);
        if(user.roomie) {
            throw new Error("Roomie data already exists for this user!");
        }

        // create roomie data
        let {
            phoneNumber, 
            region, 
            budget,
        } = req.body;

        let profileImage = "uploads/avatar-default.png";
        if(req.file) {
            profileImage = req.file.path;
        }

        let roomie = new Roomie({
            phoneNumber, 
            region, 
            budget,
            profileImage,
            name: user.firstName + " " + user.lastName
        });

        // save roomie data
        await roomie.save();

        // save roomie data on user model
        user.roomie = roomie;
        await user.save();

        // save roomie data on region model -- for easier search function
        let regionData = await findRegion(region.toLowerCase().replace(/\s+/g, ''));
        regionData.roomies.push(roomie);
        await regionData.save();

        // save roomie data on budget model -- for easier search function
        let budgetData = await Budget.findOne({amount: Number(budget)});
        console.log(budgetData);
        budgetData.roomies.push(roomie);
        await budgetData.save();

        // assign new token that contains roomie data
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
            name: region,
            roomies: []
        });
        foundRegion = await Region.findOne({"name": region});
    };
    return foundRegion;
};