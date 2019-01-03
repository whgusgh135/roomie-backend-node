const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const userSchema = new mongoose.Schema({
    id: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    }
});

userSchema.pre("save", async function(next) {
    try {
        if(!this.isModified("password")) {
            return next();
        };
        const user = this;

        await bcrypt.hash(user.password, 10)
            .then(function(hash) {
                user.password = hash;
                next();
        });
    } catch(error) {
        return next(error);
    }
});

userSchema.methods.comparePassword = async function(userPassword, next) {
    try {
        let isSame = await bcrypt.compareSync(userPassword, this.password);
        return isSame;
    } catch(error) {
        return next(error);
    }
};

module.exports = mongoose.model("User", userSchema);