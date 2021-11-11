const express = require("express");
const app = express();
const { router: productsRouter } = require("./routers/apiProducts.js");
const { router: cartsRouter } = require("./routers/apiCarts.js");

//MIDDLEWARES
app.use(express.json());
// app.use(express.urlencoded({ extended: true }));

//ROUTERS
// app.use(express.static("./public"));
app.use("/api/products", productsRouter);
app.use("/api/carts", cartsRouter);

//ROUTES
app.all("*", (req, res) => {
	res.status(404).json({ error: 404, descripción: `Route '${req.url}' and method '${req.method}' not implemented.` });
});

//START SERVER
const PORT = process.env.PORT || 8080;

const server = app.listen(PORT, () => {
	console.log(`Server on port ${server.address().port}`);
});

server.on("error", (err) => console.log(`Error in server: ${err}`));
