const express = require("express");
const graphqlHTTP = require("express-graphql");
const { initMongoose } = require("./utils/mongoose");

const { citiesSchema } = require("./models/cities");
const app = express();
const port = 4000;

app.use(
    "/graphql",
    graphqlHTTP({ schema: citiesSchema, graphiql: true, pretty: true })
);
app.use("/", graphqlHTTP({ schema: citiesSchema }));

app.listen(port, () => console.log(`node-graph listening on port ${port}!`));

initMongoose();
