const mongoose = require("mongoose");

const roomieSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required: true
    },
    lastName: {
        type: String,
        required: true
    },
    phoneNumber: {
        type: String,
        required: true
    },
    region: {
        type: String,
        required: true
    },
    minBudget: {
        type: Number,
        required: true
    },
    maxBudget: {
        type: Number,
        required: true
    },
    isActive: {
        type: Boolean,
        default: true
    }
});

module.exports = mongoose.model("Roomie", roomieSchema);