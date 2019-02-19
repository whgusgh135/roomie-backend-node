const mongoose = require("mongoose");

const rentPerWeekSchema = new mongoose.Schema({
    amount: Number,
    rents: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Rent"
    }]
});

module.exports = mongoose.model("RentPerWeek", rentPerWeekSchema);