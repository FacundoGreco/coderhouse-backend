const express = require("express");
const app = express();
const handlebars = require("express-handlebars");
const { router } = require("./api.js");
let { products } = require("./api");

//MIDDLEWARES
app.set("view engine", "ejs");
app.set("views", "./src/views");
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("./src/public"));

//ROUTES
app.get("/", (req, res) => {
	res.render("./pages/index", { products: [] });
});

app.use("/api/products", router);

//START SERVER
const PORT = process.env.PORT || 8080;

const server = app.listen(PORT, () => {
	console.log(`Server on port ${server.address().port}`);
});

server.on("error", (err) => console.log(`Error in server: ${err}`));
