const mongoose = require("mongoose");

const regionSchema = new mongoose.Schema({
    name: String,
    roomies: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Roomie"
    }]
});

module.exports = mongoose.model("Region", regionSchema);