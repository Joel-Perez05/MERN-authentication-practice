const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const UserSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required: [true, "First name is required"]
    },
    lastName: {
        type: String, 
        required: [true, "Last name is required"]
    },
    email: {
        type: String,
        required: [true, "Email is required"]
    },
    password: {
        type: String,
        required: [true, "Password is required"]
    }
}, {timestamps: true});

UserSchema.virtual("confirmPassword")
    .get(() => this._confirmPassword)
    .set((value) => this._confirmPassword = value);

UserSchema.pre("validate", function(next) {
    if (this.password !== this.confirmPassword) {
        this.invalidate("confirmPassword", "Passwords must Match!!!");
    }
    next();
});

UserSchema.pre("save", async function(next) {
    console.log("In pre save:", this.password);
    try {
        const hashedPassword = await bcrypt.hash(this.password, 10);
        console.log("Hashed:", hashedPassword);
        this.password = hashedPassword;
        next();
    } catch (error) {
        console.log("Error in save", error);
    }
});

// UserSchema.path("email").validate(async (email) => {
//     const emailCount = await mongoose.models.User.countDocuments({email})
//     return !emailCount
// }, "Email already in use")

module.exports = mongoose.model("User", UserSchema);