const jwt = require('jsonwebtoken');

// Verify JWT
const checkToken = (req, res, next) => {
    const { username } = req.body;
    if (!username) return res.status(400).json({ message: 'Bad request.'});

    const token = req.cookies['access_token'];
    if (!token) {
        return res.status(403).json({ message: 'Access denied.' });
    }

    let decodedUser;
    try {
        decodedUser = jwt.verify(token, process.env.SECRET_KEY);        
    } catch (err) {
        return res.status(403).json({ message: 'Invalid or expired token.' });
    }
        
    if (decodedUser.username !== username) return res.status(403).json({ message: 'Unauthorized request.' });
    req.user = decodedUser;
    next();
};

// Role-Based Access Control
const checkRole = (requiredRole) => {
    return (req, res, next) => {
        if (req.user.role !== requiredRole) {
            return res.status(403).json({ message: 'Access denied. Insufficient permissions.' });
        }
        next();
    };
};

module.exports = { checkToken, checkRole };
