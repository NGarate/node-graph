const cityArraySchema = [
    {
        geonameid: { type: Number, index: { unique: true } },
        name: String,
        asciiname: String,
        location: {
            type: {
                type: String,
                enum: ["Point"],
                required: true
            },
            coordinates: {
                type: [Number],
                required: true
            }
        },
        featureCode: String,
        countryCode: String,
        admin1Code: String,
        admin2Code: String,
        admin3Code: String,
        admin4Code: String,
        population: Number,
        timezone: String,
        modification: Date
    },
    { collection: "Cities" }
];

exports.buildCityModel = mongoose => {
    return getCityModel(mongoose);
};

function getCityModel({ Schema, model }) {
    const citySchema = getCitySchema(Schema);
    setUniqueIndexes(citySchema);
    return model("Cities", citySchema);
}

function getCitySchema(Schema) {
    return new Schema(...cityArraySchema);
}

function setUniqueIndexes(schema) {
    schema.index({ countryCode: 1 });
    schema.index({ geonameid: 1 }, { unique: true });
    schema.index({ name: 1 });
}
