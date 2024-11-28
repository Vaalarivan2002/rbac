const express = require('express');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/users');
const MongooseConnection = require('./factory/mongooseConnectionFactory.js')
require('dotenv').config();

const initBackend = async () => {
    const app = express();
    app.use(bodyParser.json());
    app.use(cookieParser());

    // Routes
    app.use('/auth', authRoutes);
    app.use('/users', userRoutes);

    // Error handler
    app.use((err, req, res, next) => {
        res.status(err.status || 500).json({ message: err.message || 'Internal Server Error' });
    });

    // Start the server
    const PORT = process.env.PORT || 3000;
    app.listen(PORT, () => {
        MongooseConnection.initMongo();
        console.log(`Server running on port ${PORT}`)
    });
};

try {
    initBackend();
} catch(error) {
    console.log("Something went wrong!"); 
}


