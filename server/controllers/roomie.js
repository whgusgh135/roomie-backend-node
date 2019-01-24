const Roomie = require("../models/roomie");
const Region = require("../models/region");
const User = require("../models/user");

// INDEX route - api/roomie
exports.getRoomies = async function(req, res, next) {
    try {
        let roomies = await Roomie.find({});
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

        let profileImage = req.file.path;

        region = await findRegion(region);

        let roomie = new Roomie({
            phoneNumber, 
            region, 
            minBudget, 
            maxBudget,
            profileImage
        });

        await Roomie.create(roomie);

        let user = await User.findById(res.locals.userId);
        if(user.roomie !== null) {
            throw new Error("Roomie data already exists for this user!");
        }
        user.roomie = roomie;
        await user.save();

        return res.status(200).json({"roomie": "success"});

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