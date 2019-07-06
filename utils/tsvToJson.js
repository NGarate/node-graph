const csv = require("csvtojson");
const unzipper = require("unzipper");
const request = require("request");
const { City } = require("../utils/mongooose");

exports.save = async inputUrl => {
    const responseStream = await getFileStreamPromise(inputUrl);

    csv({
        delimiter: "\t",
        quote: "off"
    })
        .fromStream(responseStream)
        .subscribe(
            json => {
                if (isNotCity(json)) return;

                try {
                    getCity(json).save();
                } catch (error) {
                    console.log(error);
                }
            },
            onError,
            onComplete
        );
};

async function getFileStreamPromise(url) {
    const { files } = await unzipper.Open.url(request, url);
    return files[0].stream();
}

function isNotCity(json) {
    return json["feature class"] !== "P";
}

function getCity(json) {
    return new City({
        geonameid: json.geonameid,
        name: json.name,
        asciiname: json.asciiname,
        location: {
            type: "Point",
            coordinates: [
                json.longitude,
                json.latitude,
                ...(json.elevation ? [json.elevation] : [])
            ]
        },
        featureCode: json["feature code"],
        countryCode: json["country code"],
        admin1Code: json["admin1 code"],
        admin2Code: json["admin2 code"],
        admin3Code: json["admin3 code"],
        admin4Code: json["admin4 code"],
        population: json.population,
        elevation: json.elevation,
        timezone: json.timezone,
        modification: json["modification date"]
    });
}

function onError(error) {
    console.log(error);
}

function onComplete() {
    console.log("All cities added correctly");
}
