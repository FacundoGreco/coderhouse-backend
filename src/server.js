const express = require("express");
const app = express();
const { router: productsRouter } = require("./routers/apiProducts.js");
// const { cartsRouter } = require("./routers/apiCarts.js");

//MIDDLEWARES
app.use(express.json());
// app.use(express.urlencoded({ extended: true }));

//ROUTES
// app.use(express.static("./public"));
app.use("/api/products", productsRouter);
// app.use("/api/carts", cartsRouter);

//START SERVER
const PORT = process.env.PORT || 8080;

const server = app.listen(PORT, () => {
	console.log(`Server on port ${server.address().port}`);
});

server.on("error", (err) => console.log(`Error in server: ${err}`));
