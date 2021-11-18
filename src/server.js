const express = require("express");
const app = express();
const path = require("path");
const { router: productsRouter } = require("./routers/apiProducts.js");
const { router: cartsRouter } = require("./routers/apiCarts.js");
const { Products } = require("./model/productsModel.js");

//MIDDLEWARES
app.use(express.json());
app.use(express.static(path.join(__dirname, "../public")));
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "/views"));

//ROUTERS
app.use("/api/products", productsRouter);
app.use("/api/carts", cartsRouter);

//ROUTES
app.get("/", async (req, res) => {
	const products = await Products.getProducts();
	res.render("pages/index", { products: products, cartProducts: [] });
});

app.all("*", (req, res) => {
	res.status(404).json({ error: 404, descripción: `Route '${req.url}' and method '${req.method}' not implemented.` });
});

//START SERVER
const PORT = process.env.PORT || 8080;

const server = app.listen(PORT, () => {
	console.log(`Server on port ${server.address().port}`);
});

server.on("error", (err) => console.log(`Error in server: ${err}`));
