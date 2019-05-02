const mongoose = require("mongoose");

const messageSchema = new mongoose.Schema({
    message: {
        type: String,
        required: true
    },
    from: {
        type: String,
        required: true
    },
    read: {
        type: Boolean,
        default: false
    }
});

module.exports = mongoose.model("Message", messageSchema);