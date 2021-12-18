import { Router } from "express";
const router = new Router();
import { validateSession } from "../server.js";

//MODEL
import { Container } from "../model/Container.js";
import { options } from "../db/options/sqlite3.js";
const model = new Container(options, "products");

//MIDDLEWARES
function validateProduct(req, res, next) {
	const { title, price, imageUrl } = req.body;
	if (!title || !price || !imageUrl) return res.status(406).json({ error: "Invalid product." });
	else next();
}

async function productsAvailable(req, res, next) {
	try {
		const response = await model.isEmpty();

		if (!response) res.status(404).json({ error: "There aren't products loaded." });
		else next();
	} catch (error) {
		res.status(500).json({ error: "Error while checking if products table is empty.", description: error.message });
	}
}

function validateId(req, res, next) {
	const id = Number(req.params.id);

	if (isNaN(id)) return res.status(400).json({ error: "The ID entered is not a number." });
	else if (!Number.isInteger(id)) return res.status(400).json({ error: "The ID entered is not an integer." });
	else {
		next();
	}
}

async function productExists(req, res, next) {
	const id = Number(req.params.id);

	try {
		const product = await model.getElementById(id);

		if (!product) res.status(404).json({ error: "Product not found" });
		else next();
	} catch (error) {
		res.status(500).json({ error: "Error while checking if product exists.", description: error.message });
	}
}

//HELPER FUNCTIONS
async function emitLoadProducts() {
	try {
		const products = await model.getElementsAll();

		const { io } = await import("../server.js");
		io.sockets.emit("loadProducts", products);
	} catch (error) {
		console.log(error.message);
	}
}

//ROUTES
//------------- GET HANDLING --------------------------------------//
router.get("/", validateSession, productsAvailable, async (req, res) => {
	try {
		const products = await model.getElementsAll();

		res.json(products);
	} catch (error) {
		res.status(500).json({ error: "Error while getting all products.", description: error.message });
	}
});

router.get("/:id", validateSession, productsAvailable, validateId, productExists, async (req, res) => {
	const id = Number(req.params.id);

	try {
		const product = await model.getElementById(id);

		res.json(product);
	} catch (error) {
		res.status(500).json({ error: "Error while getting product by ID.", description: error.message });
	}
});

//------------- POST HANDLING -------------------------------------//
router.post("/", validateSession, validateProduct, async (req, res) => {
	try {
		const product = await model.insertElement(req.body);

		res.json(product);
	} catch (error) {
		res.status(500).json({ error: "Error while inserting new product.", description: error.message });
	}

	await emitLoadProducts();
});

//------------- PUT HANDLING --------------------------------------//
router.put("/:id", validateSession, productsAvailable, validateId, productExists, async (req, res) => {
	const id = Number(req.params.id);

	try {
		const product = await model.updateElement(id, req.body);

		res.json(product);
	} catch (error) {
		res.status(500).json({ error: "Error while updating product.", description: error.message });
	}

	await emitLoadProducts();
});

//------------- DELETE HANDLING -----------------------------------//
router.delete("/:id", validateSession, productsAvailable, validateId, productExists, async (req, res) => {
	const id = Number(req.params.id);

	try {
		const product = await model.deleteElementById(id);

		res.json(product);
	} catch (error) {
		res.status(500).json({ error: "Error while deleting product.", description: error.message });
	}

	await emitLoadProducts();
});

//EXPORTS
export { router };
