const User = require("../models/user.model");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const SECRET = process.env.JWT_SECRET;
console.log("Secret:", SECRET);

const register = async (req, res) => {
    try {
        const user = new User(req.body);
        const newUser = await user.save();
        console.log("User Created", newUser);
        const userToken = jwt.sign(
            {_id: newUser._id, email: newUser.email, firstName: newUser.firstName, lastName: newUser.lastName}, 
            SECRET,
        );
        console.log("JWT:", userToken);
        res
            .status(201)
            .cookie("userToken", userToken, {httpOnly: true, expires: new Date(Date.now() + 900000)})
            .json({successMessage: "user created", user: newUser});
    } catch (error) {
        console.log("Registration Error", error);
        res.status(400).json(error);
    }
};

const login = async (req, res) => {
    const userDocument = await User.findOne({email: req.body.email});
    console.log("Userdoc", userDocument);
    if (!userDocument) {
        res.status(400).json({error: "Invalid email/password"});
    } else {
        try {
            const isPasswordValid = await bcrypt.compare(req.body.password, userDocument.password);
            if (!isPasswordValid) {
                res.status(400).json({error: "Invalid email/password"});
            } else {
                const userToken = jwt.sign({
                    _id: userDocument._id,
                    email: userDocument.email,
                    firstName: userDocument.firstName,
                    lastName: userDocument.lastName
                }, SECRET);
                console.log("JWT", userToken);
                res
                    .status(201)
                    .cookie("userToken", userToken, {httpOnly: true, expires: new Date(Date.now() + 900000)})
                    .json({successMessage: "user logged in", user: userDocument});
            };
        } catch (error) {
            console.log("Login Error", error);
            res.status(400).json({error: "Invalid email/password"})
        }
    }
};

const logout = (req, res) => {
    res.clearCookie("userToken");
    res.json({successMessage: "User logged out"});
};

const getLoggedInUser = async (req, res) => {
    console.log("Token", req.cookies);
    const user = jwt.verify(req.cookies.userToken, SECRET);
    User.findOne({_id: user._id})
        .then((user) => res.json(user))
        .catch((err) => console.log(err));
};

module.exports = {
    register,
    login,
    logout,
    getLoggedInUser
};
