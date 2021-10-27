const express = require("express");
const app = express();
const handlebars = require("express-handlebars");
const { router } = require("./api.js");
let { products } = require("./api");

//MIDDLEWARES
app.set("view engine", "pug");
app.set("views", "./src/pug/views");
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("./src/public"));

//ROUTES
app.get("/", (req, res) => {
	res.render("./partials/form", { title: "Form", title2: "Load Products" });
});

app.get("/products", (req, res) => {
	res.render("./partials/productsTable", { title: "Products", title2: "Products", products: products });
});

app.use("/api/products", router);

//START SERVER
const PORT = process.env.PORT || 8080;

const server = app.listen(PORT, () => {
	console.log(`Server on port ${server.address().port}`);
});

server.on("error", (err) => console.log(`Error in server: ${err}`));
