const express = require("express");
const app = express();
const { Container } = require("../controller/Container");
const container = new Container("./src/db/products.txt");

//ROUTES
app.get("/", (req, res) => {
	res.send("<h1>Go to /products or /randomProduct.</h1>");
});

app.get("/products", async (req, res) => {
	const products = await container.getAll();
	res.send(products);
});

app.get("/randomProduct", async (req, res) => {
	const randomProduct = await container.getRandomProduct();

	res.send(randomProduct);
});

//START SERVER
const PORT = process.env.PORT || 8080;

const server = app.listen(PORT, () => {
	console.log(`Server on port ${server.address().port}`);
});

server.on("error", (err) => console.log(`Error in server: ${err}`));
