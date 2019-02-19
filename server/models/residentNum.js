const mongoose = require("mongoose");

const residentNumSchema = new mongoose.Schema({
    residentNum: Number,
    rents: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Rent"
    }]
});

module.exports = mongoose.model("ResidentNum", residentNumSchema);