import { Router } from "express";
const router = new Router();
import { Products } from "../model/productsModel.js";

//MIDDLEWARES
import { validateId, isAdmin } from "./middlewares.js";

//HELPER FUNCTIONS
async function emitLoadProducts() {
	try {
		const products = await Products.getProducts();

		const { io } = await import("../server.js");
		io.sockets.emit("loadProducts", products);
	} catch (error) {
		console.log(error.message);
	}
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

	await emitLoadProducts();
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

	await emitLoadProducts();
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

	await emitLoadProducts();
});

//EXPORTS
export { router };
