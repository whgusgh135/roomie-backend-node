const mongoose = require("mongoose");

const regionSchema = new mongoose.Schema({
    name: String,
    roomies: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Roomie"
    }],
    rents: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Rent"
    }]
});

module.exports = mongoose.model("Region", regionSchema);