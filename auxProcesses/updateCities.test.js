const csv = require("csvtojson");
const unzipper = require("unzipper");
const request = require("request");
const { City } = require("../utils/mongoose");

const inputUrl = "https://download.geonames.org/export/dump/allCountries.zip";

const saveFile = async () => {
    try {
        await save(inputUrl);
    } catch (e) {
        console.error(e);
        process.exit();
    }
};

saveFile(inputUrl);
async function save(inputUrl) {
    const responseStream = await getFileStreamPromise(inputUrl);

    csv({
        delimiter: "\t",
        quote: "off",
        noheader: true
    })
        .fromStream(responseStream)
        .subscribe(
            json => {
                if (isNotCity(json)) return;
                saveCity(json);
            },
            onError,
            onComplete
        );
}

async function getFileStreamPromise(url) {
    const { files } = await unzipper.Open.url(request, url);
    return files[0].stream();
}

function isNotCity(json) {
    return json.field7 !== "P";
}

function saveCity(json) {
    try {
        return saveOrUpdatePromise(json);
    } catch (error) {
        console.log(error);
    }
}

function saveOrUpdatePromise(json) {
    return City.findOneAndUpdate({ geonameid: json.geonameid }, getCity(json), {
        upsert: true
    });
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

function onError(error) {
    console.log(error);
    process.exit(1);
}

function onComplete() {
    console.log("All cities added correctly");
    process.exit();
}
