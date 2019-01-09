const mongoose = require("mongoose");

const regionSchema = new mongoose.Schema({
    name: String
});

module.exports = mongoose.model("Region", regionSchema);