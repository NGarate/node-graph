const csv = require("csvtojson");
const unzipper = require("unzipper");
const { City } = require("../utils/mongoose");

exports.save = async function save(config, log) {
    try {
        if (config.markDeleted) await markAllDeleted(log);
        const stream = await getFileStreamPromise(config.filePath);
        await processStreamPromise({ stream, config, log });
    } catch (error) {
        log("Save error: ", error);
    }
};

async function getFileStreamPromise(filePath) {
    const { files } = await unzipper.Open.file(filePath);

    return files[0].stream();
}

function processStreamPromise({ stream, config, log }) {
    let saved = 0;
    return new Promise((resolve, reject) => {
        csv({
            delimiter: "\t",
            quote: "off",
            noheader: true
        })
            .fromStream(stream)
            .subscribe(
                processCSV(saved, config.markDeleted, log),
                reject,
                resolve
            );
    });
}

function processCSV(saved, markDeleted, log) {
    return (json, index) => {
        logEveryOneHundredThousand({ saved, index, log });

        if (isNotCity(json)) return;

        saved++;
        return saveCity({ saved, markDeleted, json, log });
    };
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

function saveCity({ json, markDeleted, log }) {
    try {
        return City.findOneAndUpdate(
            { geonameid: json.field1 },
            getCity(json, markDeleted),
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

function getCity(json, markDeleted) {
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
        ...(markDeleted && { deleted: false })
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
