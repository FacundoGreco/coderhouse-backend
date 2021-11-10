const { Router } = require("express");
const router = new Router();
const { Products } = require("../model/productsModel");
let admin = true;

//MIDDLEWARES
function validateId(req, res, next) {
	let id = req.params.id;
	if (!id) return next();

	id = Number(req.params.id);
	if (isNaN(id)) res.json({ error: "The ID entered is not a number." });
	else if (!Number.isInteger(id)) res.json({ error: "The ID entered is not an integer." });
	else {
		next();
	}
}

function isAdmin(req, res, next) {
	if (admin) next();
	else res.json({ error: "You haven't got administrator privileges." });
}

//ROUTES
//------------- GET HANDLING --------------------------------------//
router.get("/:id?", validateId, async (req, res) => {
	const id = Number(req.params.id);

	//SEND PRODUCT BY ID
	if (id) {
		try {
			const product = await Products.getProductById(id);

			if (product) res.json(product);
			else res.json({ error: "There's no product with that id." });
		} catch (error) {
			res.json({ error: "Error while getting product.", description: error.message });
		}

		//SEND ALL PRODUCTS
	} else {
		try {
			const products = await Products.getProducts();

			if (products.length > 0) res.json(products);
			else res.json({ error: "There aren't any products available." });
		} catch (error) {
			res.json({ error: "Error while getting products.", description: error.message });
		}
	}
});

//------------- POST HANDLING -------------------------------------//
router.post("/", isAdmin, async (req, res) => {
	const { name, description, code, imgURL, price, stock } = req.body;

	try {
		const product = new Products(name, description, code, imgURL, price, stock);
		await product.saveProduct();

		res.json(product);
	} catch (error) {
		res.json({ error: "Error while creating product.", description: error.message });
	}
});

//------------- PUT HANDLING --------------------------------------//
router.put("/:id", isAdmin, validateId, async (req, res) => {
	const id = Number(req.params.id);
	const { name, description, code, imgURL, price, stock } = req.body;

	try {
		const product = await Products.updateProduct(id, { name, description, code, imgURL, price, stock });

		if (product) res.json(product);
		else res.json({ error: "There's no product with that id." });
	} catch (error) {
		res.json({ error: "Error while updating product.", description: error.message });
	}
});

//------------- DELETE HANDLING -----------------------------------//
router.delete("/:id", isAdmin, validateId, async (req, res) => {
	const id = Number(req.params.id);

	try {
		const product = await Products.deleteProduct(id);

		if (product) res.json(product);
		else res.json({ error: "There's no product with that id." });
	} catch (error) {
		res.json({ error: "Error while deleting product.", description: error.message });
	}
});

//EXPORTS
exports.router = router;
exports.admin = admin;
