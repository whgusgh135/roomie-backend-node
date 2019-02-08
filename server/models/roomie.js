const mongoose = require("mongoose");

const roomieSchema = new mongoose.Schema({
    phoneNumber: {
        type: String,
        required: true
    },
    region: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Region",
        required: true
    },
    name: {
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
    profileImage: {
        type: String
    },
    isActive: {
        type: Boolean,
        default: true
    }
});

module.exports = mongoose.model("Roomie", roomieSchema);