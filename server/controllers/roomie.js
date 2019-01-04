const Roomie = require("../models/roomie");

// create route
exports.createRoomie = async function(req, res, next) {
    try {
        const {
            firstName, 
            lastName, 
            phoneNumber, 
            region, 
            minBudget, 
            maxBudget
        } = req.body;

        await Roomie.create({
            firstName, 
            lastName, 
            phoneNumber, 
            region, 
            minBudget, 
            maxBudget
        });
        return res.json({"roomie": "success"});

    } catch(error) {
        return next({
            status: 400,
            message: error.message
        });
    }
};

// show route
exports.findRoomie = async function(req, res, next) {
    try {
        let roomie = await Roomie.findById(req.params.id);

        return res.json({roomie});

    } catch(error) {
        return next({
            status: 400,
            message: "Cannot find the requested roomie."
        });
    }
}

// update route