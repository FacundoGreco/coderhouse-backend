const { Router } = require("express");
const router = new Router();
const { Products } = require("../model/productsModel");
let admin = true;

//MIDDLEWARES
const { validateId, isAdmin } = require("./middlewares");

//ROUTES
//------------- GET HANDLING --------------------------------------//
router.get("/:id?", validateId, async (req, res) => {
	const id = Number(req.params.id);

	//SEND PRODUCT BY ID
	if (id) {
		try {
			const product = await Products.getProductById(id);

			if (product) res.json(product);
			else res.status(404).json({ error: "There's no product with that id." });
		} catch (error) {
			res.status(500).json({ error: "Error while getting product.", description: error.message });
		}

		//SEND ALL PRODUCTS
	} else {
		try {
			const products = await Products.getProducts();

			if (products.length > 0) res.json(products);
			else res.status(404).json({ error: "There aren't any products available." });
		} catch (error) {
			res.status(500).json({ error: "Error while getting products.", description: error.message });
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
		res.status(500).json({ error: "Error while creating product.", description: error.message });
	}
});

//------------- PUT HANDLING --------------------------------------//
router.put("/:id", isAdmin, validateId, async (req, res) => {
	const id = Number(req.params.id);
	const { name, description, code, imgURL, price, stock } = req.body;

	try {
		const product = await Products.updateProduct(id, { name, description, code, imgURL, price, stock });

		if (product) res.json(product);
		else res.status(404).json({ error: "There's no product with that id." });
	} catch (error) {
		res.status(500).json({ error: "Error while updating product.", description: error.message });
	}
});

//------------- DELETE HANDLING -----------------------------------//
router.delete("/:id", isAdmin, validateId, async (req, res) => {
	const id = Number(req.params.id);

	try {
		const product = await Products.deleteProduct(id);

		if (product) res.json(product);
		else res.status(404).json({ error: "There's no product with that id." });
	} catch (error) {
		res.status(500).json({ error: "Error while deleting product.", description: error.message });
	}
});

//EXPORTS
exports.router = router;
exports.admin = admin;
