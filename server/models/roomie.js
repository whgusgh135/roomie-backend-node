const mongoose = require("mongoose");

const roomieSchema = new mongoose.Schema({
    phoneNumber: {
        type: String,
        required: true
    },
    region: {
        type: String,
        required: true
    },
    name: {
        type: String,
        required: true
    },
    budget: {
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