const express = require("express");
const graphqlHTTP = require("express-graphql");
const mongoose = require("mongoose");

const app = express();
const port = 4000;

const { schema, root } = require("./graphql/queries/products");
const { citySchema, graphql } = require("./graphql/queries/cities");

app.use(
    "/graphql",
    graphqlHTTP({
        schema,
        rootValue: root,
        graphiql: true,
        pretty: true
    })
);

app.get("/", async (req, res) => {
    const query = "{ city { name }, cities { id, name, description } }";

    const result = await graphql(citySchema, query);
    res.json(result);
});

app.listen(port, () => console.log(`Example app listening on port ${port}!`));

mongoose.connect("mongodb://localhost:27017/graphql", {
    useNewUrlParser: true,
    useUnifiedTopology: true
});
