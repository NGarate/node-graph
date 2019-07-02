const cityArraySchema = [
    {
        geonameid: { type: Number, index: { unique: true } },
        name: String,
        asciiname: String,
        latitude: String,
        longitude: String,
        featureClass: String,
        featureCode: String,
        countryCode: String,
        altCountryCodes: [String],
        admin1Code: String,
        admin2Code: String,
        admin3Code: String,
        admin4Code: String,
        population: Number,
        elevation: Number,
        timezone: String,
        modification: Date
    },
    { collection: "Cities" }
];

function getCity({ Schema, model }) {
    const citySchema = getCitySchema(Schema);
    setUniqueIndex();
    return model("City", citySchema);
}

exports.getCityModel = mongoose => {
    return getCity(mongoose);
};

function getCitySchema(Schema) {
    return new Schema(...cityArraySchema);
}

function setUniqueIndex(schema) {
    schema.index({ geonameid: 1 }, { unique: true });
}
