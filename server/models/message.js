const mongoose = require("mongoose");

const messageSchema = new mongoose.Schema({
    message: {
        type: String,
        required: true
    },
    from: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Roomie"
    },
    read: {
        type: Boolean,
        default: false
    }
});

module.exports = mongoose.model("Message", messageSchema);