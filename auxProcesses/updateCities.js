const log = require("debug")("updateCities");
const { save } = require("./saveCity");

saveFile();

async function saveFile() {
    const saveOptions = getTaskOptionsFromArgs();
    log(saveOptions);
    try {
        log("Start updating");
        await save(saveOptions, log);
        log("Updated");
        process.exit();
    } catch (error) {
        log(error);
        process.exit(1);
    }
}

function getTaskOptionsFromArgs() {
    const url = "https://download.geonames.org/export/dump/allCountries.zip";
    const markDeleted = process.argv[2] === "delete" ? true : false;

    return { url, markDeleted };
}
