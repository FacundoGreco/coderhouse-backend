const { Router } = require("express");
const router = new Router();
let products = [];

//MIDDLEWARES
function validateProduct(req, res, next) {
	const { title, price, imageUrl } = req.body;
	if (!title || !price || !imageUrl) return res.status(406).json({ error: "Invalid product." });
	else next();
}

function productsAvailable(req, res, next) {
	if (products.length === 0) return res.json({ error: "There aren't products loaded." });
	else next();
}

function validateId(req, res, next) {
	const id = Number(req.params.id);

	if (isNaN(id)) return res.json({ error: "The ID entered is not a number." });
	else if (!Number.isInteger(id)) return res.json({ error: "The ID entered is not an integer." });
	else {
		next();
	}
}

function productExists(req, res, next) {
	const id = Number(req.params.id);
	const product = products.find((product) => product.id === id);

	if (!product) return res.json({ error: "product not found" });
	else next();
}

//ROUTES
//------------- GET HANDLING --------------------------------------//
router.get("/", productsAvailable, (req, res) => {
	res.json(products);
});

router.get("/:id", productsAvailable, validateId, productExists, (req, res) => {
	const id = Number(req.params.id);
	const product = products.find((product) => product.id === id);

	res.json(product);
});

//------------- POST HANDLING -------------------------------------//
router.post("/", validateProduct, (req, res) => {
	const newId = products.length > 0 ? products[products.length - 1].id + 1 : 1;
	const newProduct = { ...req.body, id: newId };
	products.push(newProduct);

	const { io } = require("../server");
	io.sockets.emit("loadProducts", products);

	res.send(newProduct);
});

//------------- PUT HANDLING --------------------------------------//
router.put("/:id", productsAvailable, validateId, productExists, (req, res) => {
	const id = Number(req.params.id);
	const product = products.find((product) => product.id === id);

	const { title, price, imageUrl } = req.body;

	product.title = title ?? product.title;
	product.price = price ?? product.price;
	product.imageUrl = imageUrl ?? product.imageUrl;

	const { io } = require("../server");
	io.sockets.emit("loadProducts", products);

	res.json(product);
});

//------------- DELETE HANDLING -----------------------------------//
router.delete("/:id", productsAvailable, validateId, productExists, (req, res) => {
	const id = Number(req.params.id);
	products = products.filter((product) => product.id !== id);

	const { io } = require("../server");
	io.sockets.emit("loadProducts", products);

	res.json({ id: id });
});

//EXPORTS
exports.router = router;
exports.products = products;
