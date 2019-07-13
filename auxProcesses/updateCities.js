const csv = require("csvtojson");
const unzipper = require("unzipper");
const request = require("request");
const log = require("debug")("updateCities");
const { City } = require("../utils/mongoose");

const INPUT_URL = "https://download.geonames.org/export/dump/allCountries.zip";

saveFile();

async function saveFile() {
    try {
        log("Start updating");

        const result = await save(INPUT_URL);
        log(result);

        process.exit();
    } catch (error) {
        log(error);

        process.exit(1);
    }
}

async function save() {
    const responseStream = await getFileStreamPromise(INPUT_URL);
    await processStreamPromise(responseStream);
}

async function getFileStreamPromise(url) {
    const { files } = await unzipper.Open.url(request, url);
    return files[0].stream();
}

function processStreamPromise(jsonStream) {
    let saved = 0;
    return new Promise((resolve, reject) => {
        csv({
            delimiter: "\t",
            quote: "off",
            noheader: true
        })
            .fromStream(jsonStream)
            .subscribe(
                (json, index) => {
                    logEveryOneHundredThousand(saved, index);
                    if (isNotCity(json)) return;
                    if (modifiedMoreThanAWeekAgo(json)) return;
                    ++saved;
                    saveCity(json);
                },
                reject,
                resolve
            );
    });
}

function logEveryOneHundredThousand(saved, index) {
    if (index === 0) return;
    const ONE_HUNDRED_MILLION = 100000;
    if (index % ONE_HUNDRED_MILLION === 0)
        log(`Updated ${saved.toLocaleString()}/${index.toLocaleString()}`);
}

function isNotCity(json) {
    return json.field7 !== "P";
}

function modifiedMoreThanAWeekAgo(json) {
    const ONE_WEEK = 1000 * 60 * 24 * 7;
    const oneWeekAgo = Date.now() - ONE_WEEK;
    const modificationDate = new Date(json.field19).getTime();
    return modificationDate < oneWeekAgo;
}

function saveCity(json) {
    try {
        return City.findOneAndUpdate(
            { geonameid: json.field1 },
            getCity(json),
            {
                upsert: true,
                new: true,
                runValidators: true
            }
        ).exec();
    } catch (error) {
        log(error);
    }
}

function getCity(json) {
    // JSON files meaning https://download.geonames.org/export/dump/readme.txt
    return {
        geonameid: json.field1,
        name: json.field2,
        asciiname: json.field3,
        location: {
            type: "Point",
            coordinates: [
                json.field6,
                json.field5,
                ...(json.field16 ? [json.field16] : [])
            ]
        },
        featureCode: json.field9,
        countryCode: json.field10,
        admin1Code: json.field11,
        admin2Code: json.field12,
        admin3Code: json.field13,
        admin4Code: json.field14,
        population: json.field15,
        timezone: json.field18,
        modification: json.field19
    };
}
