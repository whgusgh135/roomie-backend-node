const Rent = require("../models/rent");
const Region = require("../models/region");
const User = require("../models/user");
const RentPerWeek = require("../models/rentPerWeek");
const ResidentNum = require("../models/residentNum");
const config = require("../config/dev");
const jwt = require("jsonwebtoken");
const fs = require("fs");

// INDEX route - api/rent
exports.getRents = async function(req, res, next) {
    try {
        const region = req.query.region;
        if(region) {
            let foundRegion = await Region.find({name: {"$regex": region}}).populate("rents");
            
            foundRents = [].concat.apply([],foundRegion.map(region => region.rents));

            return res.status(200).json(foundRents);
        }
        const numRes = req.query.numRes;
        if(numRes) {
            let foundRents = await ResidentNum.findOne({residentNum: numRes}).populate("rents");
            return res.status(200).json(foundRents.rents);
        }
        const rentPerWeek = req.query.rent;
        if(rentPerWeek) {
            let foudnRents = await RentPerWeek.findOne({amount: rentPerWeek}).populate("rents");
            return res.status(200).json(foudnRents.rents);
        }

        let rents = await Rent.find({}).limit(parseInt(req.query.num));
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
        // create roomie data
        let {
            propertyType,
            region,
            address,
            numberOfRooms,
            maxResidents,
            rentPerWeek,
            description,
            phoneNumber,
            email
        } = req.body;

        // saving multiple image file save paths
        let rentImages = [];
        req.files.forEach(file => rentImages.push(file.path));
        if(req.files.length === 0) {
            rentImages.push("uploads/house-default.jpg");
        }

        let rent = new Rent({
            propertyType,
            region,
            address,
            numberOfRooms,
            maxResidents,
            rentPerWeek,
            description,
            rentImages,
            phoneNumber,
            email
        });

        // save rent data
        await Rent.create(rent);

        // save rent data on user model
        let user = await User.findById(res.locals.userId);
        user.rent.push(rent);
        await user.save();

        // save rent data on region model -- for easier search function
        let regionData = await findRegion(region.toLowerCase().replace(/\s+/g, ''));
        regionData.rents.push(rent);
        await regionData.save();

        // save rent data on rentPerWeek model -- for easier search function
        let roundedNum = Math.ceil(Number(rentPerWeek)/100) * 100;
        if(roundedNum > 1000) roundedNum = 1100;
        let rentPerWeekData = await RentPerWeek.findOne({amount: Number(roundedNum)});
        // if(!rentPerWeekData) {
        //     await RentPerWeek.create({amount: roundedNum})
        //     rentPerWeekData = await RentPerWeek.findOne({amount: Number(roundedNum)});
        // }
        rentPerWeekData.rents.push(rent);
        await rentPerWeekData.save();

        // save rent data on residentNum model -- for easier search function
        let maxResidentsData = await ResidentNum.findOne({residentNum: Number(maxResidents)});
        // if(!maxResidents){
        //     await ResidentNum.create({residentNum: maxResidents});
        //     maxResidentsData = await ResidentNum.findOne({residentNum: Number(maxResidents)});
        // }
        maxResidentsData.rents.push(rent);
        await maxResidentsData.save();

        // return success message
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
        let user = await User.findById(req.params.id).populate("rent").populate("roomie");

        let index = user.rent.findIndex(obj => obj._id == req.body.id);

        if(req.files) {
            console.log(index);
            await user.rent[index].rentImages.forEach(img => {
                fs.unlink(img);
            });
            console.log(user.rent[index].rentImages)

            let rentImages = [];
            req.files.forEach(file => rentImages.push(file.path));
            req.body.rentImages = rentImages;
        }
        console.log(req.body);
        
        await Rent.findByIdAndUpdate(user.rent[index]._id, req.body);;

        user = await User.findById(req.params.id).populate("rent").populate("roomie");

        const token = jwt.sign({
            userId: user._id,
            roomie: user.roomie,
            rent: user.rent,
            firstName: user.firstName,
            lastName: user.lastName
        }, config.JWT_KEY, {expiresIn: "1h"});

        return res.json({
            token,
            userId: user._id,
            firstName: user.firstName,
            lastName: user.lastName,
            rent: user.rent,
            roomie: user.roomie
        });

        return res.json({"update": "success"});
    } catch(error) {
        return next(error);
    }
}

// DELETE route - api/rent/:id
exports.deleteRent = async function(req, res, next) {
    try {
        let user = await User.findById(req.params.id).populate("rent");
        console.log(req.body)
        let index = user.rent.findIndex(obj => obj._id == req.body.id);
    
        await user.rent[index].rentImages.forEach(img => {
            fs.unlink(img);
        });
        await Rent.findById(user.rent[index]._id).remove();

        user.rent = user.rent.filter(rent => rent._id !== req.body.id);
        await User.updateOne({_id: req.params.id}, user);

        return res.status(200).json({"rent": "deleted"});
    } catch(error) {
        return next(error);
    }
};

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