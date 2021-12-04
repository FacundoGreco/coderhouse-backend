import { MongoClient } from "mongodb";
import config from "../../config.js";

const client = new MongoClient(config.mongoDB.uri, config.mongoDB.options);
await client.connect();

const productsCollection = client.db(config.mongoDB.db).collection("products");
const cartsCollection = client.db(config.mongoDB.db).collection("carts");

export { productsCollection, cartsCollection };
