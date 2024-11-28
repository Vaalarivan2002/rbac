const express = require('express');
const { checkToken, checkRole } = require('../middleware/authMiddleware');
const Role = require("../constants/roles.js");

const router = express.Router();

// User endpoint
router.get('/user', checkToken, checkRole(Role.User), (req, res) => {
    res.json({ message: 'Welcome, User!' });
});

// Moderator endpoint
router.get('/moderator', checkToken, checkRole(Role.Moderator), (req, res) => {
    res.json({ message: 'Welcome, Moderator!' });
});

// Admin endpoint
router.get('/admin', checkToken, checkRole(Role.Admin), (req, res) => {
    res.json({ message: 'Welcome, Admin!' });
});

module.exports = router;
