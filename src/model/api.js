const { Router } = require("express");
const router = new Router();
const products = [{ title: "onion-rings", price: 200, thumbnail: "https://i.ibb.co/Fzbhvp9/onion-rings.jpg", id: 1 }];

//MIDDLEWARES
function productsAvailable(req, res, next) {
	if (products.length === 0) return res.send("<h1>There aren't products loaded.</h1>");
	else next();
}

function validateId(req, res, next) {
	const id = Number(req.params.id);

	if (isNaN(id)) return res.send("<h1>The ID entered is not a number.</h1>");
	else if (!Number.isInteger(id)) return res.send("<h1>The ID entered is not an integer.</h1>");
	else {
		next();
	}
}

function productExists(req, res, next) {
	const id = Number(req.params.id);
	const product = products.find((product) => product.id === id);

	if (!product) return res.send("<h1>There isn't any product with that ID</h1>");
	else next();
}

//ROUTES
//------------- GET HANDLING -------------------------------------//
router.get("/", productsAvailable, (req, res) => {
	res.json(products);
});

router.get("/:id", productsAvailable, validateId, productExists, (req, res) => {
	const id = Number(req.params.id);
	const product = products.find((product) => product.id === id);

	res.json(product);
});

//------------- POST HANDLING -------------------------------------//
router.post("/", (req, res) => {
	const newId = products[products.length - 1].id + 1;
	products.push({ ...req.body, id: newId });

	res.json(products[products.length - 1]);
});

//------------- PUT HANDLING -------------------------------------//
router.put("/:id", productsAvailable, validateId, productExists, (req, res) => {
	const id = Number(req.params.id);
	const product = products.find((product) => product.id === id);

	const { title, price, thumbnail } = req.body;

	product.title = title ?? product.title;
	product.price = price ?? product.price;
	product.thumbnail = thumbnail ?? product.thumbnail;

	console.log(products);

	res.json(product);
});

exports.router = router;
