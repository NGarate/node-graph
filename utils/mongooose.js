const mongoose = require("mongoose");
const { getCityModel } = require("../models/cities");

mongoose.connect(
    "mongodb://graphqlUser:jt12,2qG9FU8_vDSCA$-UszdxQRCvw6'vAfIpkNl#cQAA@localhost:27017/graphql",
    { useNewUrlParser: true }
);
const db = mongoose.connection;

db.on("error", error => {
    console.log(error);
});

db.once("open", () => {
    console.log("Connected to mongoose");
});

exports.City = getCityModel(mongoose);
