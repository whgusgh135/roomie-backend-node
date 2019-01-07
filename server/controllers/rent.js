const Rent = require("../models/rent");

// INDEX route - api/rent
exports.getRents = async function(req, res, next) {
    try {
        let rents = await Rent.find({});
        return res.status(200).json(rents);
    } catch(error) {
        return next({
            status: 400,
            message: "Something gone wrong in getting rent data."
        })
    }
};

// SHOW route - api/rent/:id
exports.selectRent = async function(req, res, next) {
    try {
        let rent = await Rent.findById(req.params.id);
        return res.status(200).json(rent);
    } catch(error) {
        return next({
            status: 400,
            message: "Could not find the requested rent data"
        })
    }
}

// CREATE route - api/rent/new
exports.createRents = async function(req, res, next) {
    try {
        const {
            propertyType,
            location,
            numberOfRooms,
            minResidents,
            maxResidents,
            rentPerWeek,
            description
        } = req.body;

        await Rent.create({
            propertyType,
            location,
            numberOfRooms,
            minResidents,
            maxResidents,
            rentPerWeek,
            description
        });
        return res.json({"rent": "success"});

    } catch(error) {
        return next({
            status: 400,
            message: "Something gone wrong in creating a data."
        })
    }
};

// UPDATE route - api/rent/:id
exports.updateRent = async function(req, res, next) {
    try {
        await Rent.findByIdAndUpdate(req.params.id, req.body);
        return res.json({"update": "success"});
    } catch(error) {
        return next(error);
    }
}

// DELETE route - api/rent/:id
exports.deleteRent = async function(req, res, next) {
    try {
        await Rent.findById(req.params.id).remove();
        return res.json({"rent": "deleted"});
    } catch(error) {
        return next(error);
    }
};