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
                const city = new City({
                    geonameid: json.geonameid,
                    name: json.name,
                    asciiname: json.asciiname,
                    latitude: json.latitude,
                    longitude: json.longitude,
                    featureClass: json["feature class"],
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
                city.save();
            },
            onError,
            onComplete
        );
};

function onError(error) {
    console.log(error);
}

function onComplete(data) {
    console.log(data);
}
