const express = require("express");
const app = express();
const handlebars = require("express-handlebars");
const { router } = require("./api.js");
let { products } = require("./api");

//MIDDLEWARES
app.engine(
	"hbs",
	handlebars({
		extname: ".hbs",
		defaultLayout: "index.hbs",
		layoutsDir: __dirname + "/views/layouts",
		partialsDir: __dirname + "/views/partials",
	})
);
app.set("view engine", "hbs");
app.set("views", "./src/hbs/views");
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("./src/public"));

//ROUTES
app.get("/", (req, res) => {
	res.render("./partials/form", {
		title: "Form",
		title2: "Load Products",
		goToPage: "Products",
		goToPageUrl: "/products",
	});
});

app.get("/products", (req, res) => {
	res.render("./partials/products", {
		title: "Products",
		title2: "Products Added",
		goToPage: "Form",
		goToPageUrl: "/",
		products: products,
	});
});

app.use("/api/products", router);

//START SERVER
const PORT = process.env.PORT || 8080;

const server = app.listen(PORT, () => {
	console.log(`Server on port ${server.address().port}`);
});

server.on("error", (err) => console.log(`Error in server: ${err}`));
