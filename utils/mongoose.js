const mongoose = require("mongoose");
const { buildCityModel } = require("../models/cities");

mongoose.connect(
    "mongodb://graphqlUser:jt12,2qG9FU8_vDSCA$-UszdxQRCvw6'vAfIpkNl#cQAA@localhost:27017/graphql",
    {
        useCreateIndex: true,
        useNewUrlParser: true,
        useFindAndModify: false,
        useUnifiedTopology: true,
        poolSize: 10
    }
);
const db = mongoose.connection;

db.on("error", error => {
    console.log(error);
});

db.once("open", () => {
    console.log("Connected to mongoose");
});

exports.City = buildCityModel(mongoose);
