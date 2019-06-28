const express = require("express");
const graphqlHTTP = require("express-graphql");
const mongoose = require( 'mongoose');
const app = express();
const port = 4000;

const { schema, root } = require("./schemas/product");
const { citySchema, graphql } = require("./schemas/city");

app.use(
  "/graphql",
  graphqlHTTP({
    schema,
    rootValue: root,
    graphiql: true
  })
);

app.get("/", async (req, res) => {
    const query = `{ city { name }, cities { id, name, description } }`;

    const result = await graphql(citySchema, query);
    res.json(result);
});

app.listen(port, () => console.log(`Example app listening on port ${port}!`));