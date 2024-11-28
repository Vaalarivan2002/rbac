const UserModel = require('../models/UserModel.js');

class User {
    static async getUserFromDatabase(username) {
        const user = await UserModel.findOne({ username: username });
        return user;
    }
};

module.exports = User;