const mongoose = require("mongoose");

const rentSchema = new mongoose.Schema({
    propertyType: {
        type: String,
        required: true
    },
    region: {
        type: String,
        required: true
    },
    address: {
        type: String,
        required: true
    },
    numberOfRooms: {
        type: Number,
        required: true
    },
    maxResidents: {
        type: Number,
        required: true
    },
    rentPerWeek: {
        type: Number,
        required: true
    },
    description: {
        type: String
    },
    rentImages: [{
        type: String
    }],
    phoneNumber: {
        type: String,
    },
    email: {
        type: String
    }
});

module.exports = mongoose.model("Rent", rentSchema);