const csv = require("csvtojson");
const fs = require("fs");
const { City } = require("../utils/mongooose");

exports.save = async inputPath => {
    const readStream = fs.createReadStream(inputPath, "utf8");

    csv({
        delimiter: "\t",
        quote: "off"
    })
        .fromStream(readStream)
        .subscribe(
            json => {
                if (isNotCity(json)) return;
                const city = new City({
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
                    altCountryCodes: Array.from(json.cc2),
                    admin1Code: json["admin1 code"],
                    admin2Code: json["admin2 code"],
                    admin3Code: json["admin3 code"],
                    admin4Code: json["admin4 code"],
                    population: json.population,
                    elevation: json.elevation,
                    timezone: json.timezone,
                    modification: json["modification date"]
                });
                try {
                    city.save();
                } catch (error) {
                    console.log(error);
                }
            },
            onError,
            onComplete
        );
};

function isNotCity(json) {
    return json["feature class"] !== "P";
}

function onError(error) {
    console.log(error);
}

function onComplete(data) {
    console.log(data);
}
