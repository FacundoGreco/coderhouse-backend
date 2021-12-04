import { Router } from "express";
const router = new Router();
import { CartsDao } from "../daos/daosExporter.js";
import { ProductsDao } from "../daos/daosExporter.js";

//MIDDLEWARES
import { validateId, validateIdProd } from "./middlewares.js";

//ROUTES
//------------- GET HANDLING --------------------------------------//
router.get("/:id/products", validateId, async (req, res) => {
	const id = Number(req.params.id);

	try {
		const cartProducts = await CartsDao.getCartProducts(id);

		if (cartProducts) res.json(cartProducts);
		else res.status(404).json({ error: "There's no cart with that id." });
	} catch (error) {
		res.status(500).json({ error: "Error while getting cart products.", description: error.message });
	}
});

//------------- POST HANDLING -------------------------------------//
router.post("/", async (req, res) => {
	try {
		const cart = new CartsDao();
		await cart.saveCart();

		res.json(cart);
	} catch (error) {
		res.status(500).json({ error: "Error while creating cart.", description: error.message });
	}
});

router.post("/:id/products/:idProd", validateId, validateIdProd, async (req, res) => {
	const id = Number(req.params.id);
	const idProd = Number(req.params.idProd);

	try {
		const product = await ProductsDao.getProductById(idProd);

		if (product) {
			const response = await CartsDao.addProduct(id, product);

			if (response) res.json(response);
			else res.status(404).json({ error: "There's no cart with that id." });
		} else {
			res.status(404).json({ error: "There's no product with that id." });
		}
	} catch (error) {
		res.status(500).json({ error: "Error while adding product to cart.", description: error.message });
	}
});

//------------- DELETE HANDLING -----------------------------------//
router.delete("/:id", validateId, async (req, res) => {
	const id = Number(req.params.id);

	try {
		const cart = await CartsDao.deleteCart(id);

		if (cart) res.json(cart);
		else res.status(404).json({ error: "There's no cart with that id." });
	} catch (error) {
		res.status(500).json({ error: "Error while deleting cart.", description: error.message });
	}
});

router.delete("/:id/products/:idProd", validateId, validateIdProd, async (req, res) => {
	const id = Number(req.params.id);
	const idProd = Number(req.params.idProd);

	try {
		const { cart, product } = await CartsDao.deleteProduct(id, idProd);

		if (cart && product) {
			res.json(product);
		} else if (!cart) {
			res.status(404).json({ error: "There's no cart with that id." });
		} else {
			res.status(404).json({ error: "There's no product with that id." });
		}
	} catch (error) {
		res.status(500).json({ error: "Error while removing product from cart.", description: error.message });
	}
});

//EXPORTS
export { router };
