const axios = require("axios");
const fs = require("fs");
const path = require("path");
const log = require("debug")("updateCities");
const { save } = require("./saveCity");

saveFile();

async function saveFile() {
    const config = getConfig();
    log(config);
    try {
        log("Start downloading");
        await downloadZip(config.filePath);
        log("Downloaded");

        log("Start updating");
        await save(config, log);
        log("Updated");

        process.exit();
    } catch (error) {
        log(error);
        process.exit(1);
    }
}

function getConfig() {
    return {
        markDeleted: process.argv[2] === "delete",
        filePath: path.resolve(__dirname, "..", "zipFiles", "allCountries.zip")
    };
}

async function downloadZip(filePath) {
    // TODO Only download if file it's older than 2 days -fs.promises.stat or corrupted?
    const writer = fs.createWriteStream(filePath, { flags: "w" });

    const response = await axios({
        url: "https://download.geonames.org/export/dump/allCountries.zip",
        method: "GET",
        responseType: "stream"
    });

    response.data.pipe(writer);

    return new Promise((resolve, reject) => {
        writer.on("finish", resolve);
        writer.on("error", reject);
    });
}
