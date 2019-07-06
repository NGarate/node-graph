const { save } = require("../utils/tsvToJson");

const inputUrl = "https://download.geonames.org/export/dump/allCountries.zip";

const saveFile = async () => {
    try {
        await save(inputUrl);
    } catch (e) {
        console.error(e);
    }
};

saveFile(inputUrl);
