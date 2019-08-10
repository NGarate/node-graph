const log = require("debug")("updateCities");
const { save } = require("./saveCity");

saveFile();

async function saveFile() {
    const saveOptions = getTaskOptionsFromArgs;
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
    const arg = process.argv[2];
    const url = "https://download.geonames.org/export/dump/allCountries.zip";

    if (isStringAnInteger(arg))
        return { markDeleted: false, daysAgo: parseInt(arg) };

    if (arg === "delete") return { url, markDeleted: true, daysAgo: 0 };
    return { url, markDeleted: false, daysAgo: 15 };
}

function isStringAnInteger(string) {
    return Number.isInteger(parseInt(string));
}
