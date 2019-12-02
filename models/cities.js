const { composeWithMongoose } = require("graphql-compose-mongoose/node8");
const { schemaComposer } = require("graphql-compose");
const { model, Schema } = require("mongoose");

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
        countryCode: String,
        admin1Code: String,
        admin2Code: String,
        admin3Code: String,
        admin4Code: String,
        population: Number,
        timezone: String,
        modification: Date,
        deleted: Boolean
    },
    { collection: "Cities" }
];

const citySchema = new Schema(...cityArraySchema);
citySchema.index({ countryCode: 1 });
citySchema.index({ geonameid: 1 }, { unique: true });
citySchema.index({ name: 1 });

const Cities = model("Cities", citySchema);

const customizationOptions = {}; // left it empty for simplicity, described below
const CitiesTC = composeWithMongoose(Cities, customizationOptions);

schemaComposer.Query.addFields({
    cityById: CitiesTC.getResolver("findById"),
    cityByIds: CitiesTC.getResolver("findByIds"),
    cityOne: CitiesTC.getResolver("findOne"),
    cityMany: CitiesTC.getResolver("findMany"),
    cityCount: CitiesTC.getResolver("count"),
    cityConnection: CitiesTC.getResolver("connection"),
    cityPagination: CitiesTC.getResolver("pagination")
});

const citiesSchema = schemaComposer.buildSchema();

exports.citiesSchema = citiesSchema;
exports.Cities = Cities;
