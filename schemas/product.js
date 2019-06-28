const { buildSchema } = require("graphql");

exports.schema = buildSchema(`
  type Product {
    name: String,
    id: Int
  },
  type Query {
    hello: String,
    products: [Product]
  }
`);

exports.root = {
    hello: () => {
        return "Hello world!";
    },
    products: () => {
        return getProducts();
    }
};

const getProducts = () => {
    return Promise.resolve([
        {
            title: "Movie"
        }
    ]);
};
