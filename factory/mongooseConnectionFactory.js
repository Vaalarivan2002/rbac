const mongoose = require('mongoose');

class MongooseConnection {
    static listenToMongoEvents = () => {
        mongoose.connection.on("disconnected", () => {
            console.log("DB disconnected");
        });
    }

    static initMongo = async () => {
        MongooseConnection.listenToMongoEvents();
        await mongoose.connect(process.env.MONGO);
    }
};

module.exports = MongooseConnection;