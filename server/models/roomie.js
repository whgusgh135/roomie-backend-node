const mongoose = require("mongoose");

const roomieSchema = new mongoose.Schema({
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
    description: {
        type: String
    },
    profileImage: {
        type: String
    },
    messages: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Message"
    }]
});

module.exports = mongoose.model("Roomie", roomieSchema);