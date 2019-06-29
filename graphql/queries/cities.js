const {
    graphql,
    GraphQLSchema,
    GraphQLObjectType,
    GraphQLString,
    GraphQLList
} = require("graphql");

const cityType = new GraphQLObjectType({
    name: "Human",
    fields: () => ({
        id: { type: GraphQLString },
        description: { type: GraphQLString },
        name: { type: GraphQLString }
    })
});

const cities = [{ id: "unid", description: "unaciudadbonita", name: "Madrid" }];

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
