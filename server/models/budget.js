const mongoose = require("mongoose");

const budgetSchema = new mongoose.Schema({
    amount: Number,
    roomies: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Roomie"
    }]
});

module.exports = mongoose.model("Budget", budgetSchema);