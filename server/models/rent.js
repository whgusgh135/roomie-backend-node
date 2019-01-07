const mongoose = require("mongoose");

const rentSchema = new mongoose.Schema({
    propertyType: {
        type: String,
        required: true
    },
    location: {
        type: String,
        required: true
    },
    numberOfRooms: {
        type: Number,
        required: true
    },
    minResidents: {
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
    }
});

module.exports = mongoose.model("Rent", rentSchema);