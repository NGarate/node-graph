const express = require("express");
const graphqlHTTP = require("express-graphql");
const mongoose = require("mongoose");
const multer = require("multer");
const csv = require("csvtojson");

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

const upload = multer({ dest: "uploads/" });

app.post("/upload/csv", upload.array("csv", 10), async (req, res) => {
    for (const { path: csvFile, originalname: filename } of req.files) {
        const jsonArray = await csv().fromFile(csvFile);
        console.log(jsonArray);
    }
    res.json({ response: "ok" });
});

app.listen(port, () => console.log(`Example app listening on port ${port}!`));

mongoose.connect("mongodb://localhost:27017/graphql", {
    useNewUrlParser: true
});
