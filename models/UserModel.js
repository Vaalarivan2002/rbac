const mongoose = require('mongoose');
const Role = require("../constants/roles.js");

const UserSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true,
        required: true,
    },
    password: {
        type: String,
        required: true,
    },
    role: {
        type: String,
        required: true,
        enum: [Role.Admin, Role.Moderator, Role.User],
    },  
}, 
{ timestamps: true})

module.exports = mongoose.model("UserModel", UserSchema);