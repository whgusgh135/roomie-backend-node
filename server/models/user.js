const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const userSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required: true
    },
    lastName: {
        type: String,
        required: true
    },
    id: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    roomie: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Roomie"
    },
    rent: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Rent"
    }]
});

// before new user data is saved, this is performed
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

// this method is needed for updating password
// otherwise, new password would be saved without hashing
userSchema.methods.hashPassword = async function(password, next) {
    try {
        let hashedPassword = await bcrypt.hash(password, 10)
        return hashedPassword;
    } catch(error) {
        return next(error);
    }
};

// method to compare unhashed user input with hashed password 
userSchema.methods.comparePassword = async function(userPassword, next) {
    try {
        let isSame = await bcrypt.compareSync(userPassword, this.password);
        return isSame;
    } catch(error) {
        return next(error);
    }
};

module.exports = mongoose.model("User", userSchema);