const path = require("path");
const { save } = require("../utils/tsvToJson");

const inputFile = path.join(__dirname, "../datafiles/allCountries.tsv");

const saveFile = async () => {
    try {
        await save(inputFile);
    } catch (e) {
        console.error(e);
    }
};

saveFile(inputFile);
