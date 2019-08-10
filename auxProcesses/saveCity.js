const csv = require("csvtojson");
const unzipper = require("unzipper");
const request = require("request");
const { City } = require("../utils/mongoose");
const { setDeleteFalse } = require("./setDeleteFalse");

exports.save = async function save(options, log) {
    if (options.markDeleted) markAllDeleted(log);
    const stream = await getFileStreamPromise(options.url);
    await processStreamPromise({ stream, options, log });
};

async function getFileStreamPromise(url) {
    const { files } = await unzipper.Open.url(request, url);
    return files[0].stream();
}

function processStreamPromise({ stream, options, log }) {
    let saved = 0;
    return new Promise((resolve, reject) => {
        csv({
            delimiter: "\t",
            quote: "off",
            noheader: true
        })
            .fromStream(stream)
            .subscribe(processCSV(saved, options, log), reject, resolve);
    });
}

function processCSV(saved, { markDeleted, daysAgo }, log) {
    return (json, index) => {
        logEveryOneHundredThousand({ saved, index, log });

        if (isNotCity(json)) return;

        if (markDeleted && modifiedMoreThan(daysAgo, json)) {
            setDeleteFalse(json, log);
        }

        return saveCity({ saved, json, log });
    };
}

function modifiedMoreThan(days, json) {
    const timeLapse = 1000 * 60 * 24 * days;
    const oneWeekAgo = Date.now() - timeLapse;
    const modificationDate = new Date(json.field19).getTime();
    return modificationDate < oneWeekAgo;
}

function logEveryOneHundredThousand({ saved, index, log }) {
    if (index === 0) return;
    const ONE_HUNDRED_THOUSAND = 100000;
    if (index % ONE_HUNDRED_THOUSAND === 0)
        log(`Updated ${saved.toLocaleString()}/${index.toLocaleString()}`);
}

function isNotCity(json) {
    return json.field7 !== "P";
}

// eslint-disable-next-line no-unused-vars
function saveCity({ saved, json, log }) {
    saved++;

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
    // JSON files dictionary https://download.geonames.org/export/dump/readme.txt
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
        modification: json.field19,
        deleted: false
    };
}

async function markAllDeleted(log) {
    try {
        const res = await City.updateMany({}, { deleted: true });
        log("markAllDeleted result: ", res);
    } catch (error) {
        log("markAllDeleted error: ", error);
    }
}
