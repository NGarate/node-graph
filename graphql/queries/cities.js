const {
    graphql,
    GraphQLBoolean,
    GraphQLScalarType,
    GraphQLFloat,
    GraphQLInt,
    GraphQLList,
    GraphQLObjectType,
    GraphQLString,
    GraphQLSchema
} = require("graphql");
const { DateTimeType } = require("../Types/DateTimeType/");

const cityType = new GraphQLObjectType({
    fields: {
        geonameid: { type: Number, index: { unique: true } },
        name: GraphQLString,
        asciiname: GraphQLString,
        location: {
            type: {
                type: GraphQLString
            },
            coordinates: {
                type: [GraphQLFloat]
            }
        },
        countryCode: GraphQLString,
        admin1Code: GraphQLString,
        admin2Code: GraphQLString,
        admin3Code: GraphQLString,
        admin4Code: GraphQLString,
        population: GraphQLInt,
        timezone: GraphQLString,
        modification: DateTimeType,
        deleted: GraphQLBoolean
    }
});

exports.schema = new GraphQLSchema({
    query: new GraphQLObjectType({
        name: "RootQueryType",
        fields: {
            city: {
                type: cityType,
                resolve() {
                    return cities[0];
                }
            },
            cities: {
                type: new GraphQLList(cityType),
                resolve() {
                    return cities;
                }
            }
        }
    })
});

exports.graphql = graphql;
