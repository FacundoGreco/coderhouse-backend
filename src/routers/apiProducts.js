const { Router } = require("express");
const router = new Router();
let products = [];

//MIDDLEWARES
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
router.post("/", (req, res) => {
	const newId = products.length > 0 ? products[products.length - 1].id + 1 : 1;
	products.push({ ...req.body, id: newId });

	res.json(products[products.length - 1]);
});

//------------- PUT HANDLING --------------------------------------//
router.put("/:id", productsAvailable, validateId, productExists, (req, res) => {
	const id = Number(req.params.id);
	const product = products.find((product) => product.id === id);

	const { title, price, thumbnail } = req.body;

	product.title = title ?? product.title;
	product.price = price ?? product.price;
	product.thumbnail = thumbnail ?? product.thumbnail;

	res.json(product);
});

//------------- DELETE HANDLING -----------------------------------//
router.delete("/:id", productsAvailable, validateId, productExists, (req, res) => {
	const id = Number(req.params.id);
	products = products.filter((product) => product.id !== id);

	res.json({ id: id });
});

//EXPORTS
exports.router = router;
