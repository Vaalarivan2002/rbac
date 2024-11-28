const createError = require("../utils/error.js");
const checkNullFields = require("../utils/checkNullFields.js");
const User = require('./../factory/userFactory.js');
const UserModel = require('../models/UserModel.js');
const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const { checkToken } = require('../middleware/authMiddleware');

const router = express.Router();

const generateJwtToken = (username, role) => {
    return jwt.sign({ username: username, role: role }, process.env.SECRET_KEY, { expiresIn: process.env.JWT_EXPIRES });
}

const generateHashedPassword = (password) => {
    const salt = bcrypt.genSaltSync(10);
    const hash = bcrypt.hashSync(password, salt);
    return hash;
}

const createUserObjectUsingModel = (username, role, nonHashedPassword) => {
    return new UserModel({
        username: username,
        role: role,
        password: generateHashedPassword(nonHashedPassword),
    });
}

const setAccessTokenCookie = (res, tokenName, token, cookieProps) => {
    if (cookieProps) {
        return res.cookie(tokenName, token, cookieProps);
    }
    return res.cookie(tokenName, token);
}

const sendRegisterSuccessResponse = (res, user) => {
    const { password, role, ...otherDetails } = user._doc;
    res.status(201).json({
        message: "Register success!",
        ...otherDetails
    });
}

const addUserToDatabase = async (userObj) => {
    await userObj.save();
}

const registerUser = async (req, res, next) => {
    const { username, role, password } = req.body;

    if (checkNullFields(username, role, password)) return next(createError("All fields are required.", 400));

    let existingUser = await User.getUserFromDatabase(username);
    if (existingUser) return next(createError("Username has already been taken.", 400));

    const token = generateJwtToken(username, role);
    const newUser = createUserObjectUsingModel(username, role, password);

    await addUserToDatabase(newUser);
    res = setAccessTokenCookie(res, 'access_token', token, { httpOnly: true });
    sendRegisterSuccessResponse(res, newUser);
}

// Register a new user
router.post('/register', async (req, res, next) => {
    try {
        registerUser(req, res, next);
    } catch (err) {
        return next(createError("Something went wrong!", 500));
    }
});

const loginUser = async (req, res) => {
    const { username, password, role } = req.body;
    let user = await User.getUserFromDatabase(username);

    if (!user) return res.status(401).json({ message: 'User not found.' });

    if (!(await bcrypt.compare(password, user.password))) return res.status(401).json({ message: 'Invalid credentials.' });
    
    const token = generateJwtToken(username, role);
    res = setAccessTokenCookie(res, 'access_token', token, { httpOnly: true });
    res.status(200).json({ message: 'Login successful.' });
}

// Login user
router.post('/login', async (req, res, next) => {
    try {
        loginUser(req, res);
    } catch (err) {
        return next(createError("Something went wrong!", 500));
    }
});

// Logout
router.post('/logout', checkToken, (req, res) => {
    res = setAccessTokenCookie(res, 'access_token', '', { maxAge: 1 });
    res.status(200).json({ message: 'Logged out successfully.' });
});

module.exports = router;
