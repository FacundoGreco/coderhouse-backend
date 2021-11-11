const { Router } = require("express");
const router = new Router();
const { Carts } = require("../model/cartsModel");
const { Products } = require("../model/productsModel");
let admin = require("./apiCarts");

//MIDDLEWARES
const { validateId, validateIdProd } = require("./middlewares.js");

//ROUTES
//------------- GET HANDLING --------------------------------------//
router.get("/:id/products", validateId, async (req, res) => {
	const id = Number(req.params.id);

	try {
		const cartProducts = await Carts.getCartProducts(id);

		if (cartProducts) res.json(cartProducts);
		else res.json({ error: "There's no cart with that id." });
	} catch (error) {
		res.json({ error: "Error while getting cart products.", description: error.message });
	}
});

//------------- POST HANDLING -------------------------------------//
router.post("/", async (req, res) => {
	try {
		const cart = new Carts();
		await cart.saveCart();

		res.json(cart);
	} catch (error) {
		res.json({ error: "Error while creating cart.", description: error.message });
	}
});

router.post("/:id/products/:idProd", validateId, validateIdProd, async (req, res) => {
	const id = Number(req.params.id);
	const idProd = Number(req.params.idProd);

	try {
		const product = await Products.getProductById(idProd);

		if (product) {
			const response = await Carts.addProduct(id, product);

			if (response) res.json(response);
			else res.json({ error: "There's no cart with that id." });
		} else {
			res.json({ error: "There's no product with that id." });
		}
	} catch (error) {
		res.json({ error: "Error while adding product to cart.", description: error.message });
	}
});

//------------- DELETE HANDLING -----------------------------------//
router.delete("/:id", validateId, async (req, res) => {
	const id = Number(req.params.id);

	try {
		const cart = await Carts.deleteCart(id);

		if (cart) res.json(cart);
		else res.json({ error: "There's no cart with that id." });
	} catch (error) {
		res.json({ error: "Error while deleting cart.", description: error.message });
	}
});

router.delete("/:id/products/:idProd", validateId, validateIdProd, async (req, res) => {
	const id = Number(req.params.id);
	const idProd = Number(req.params.idProd);

	try {
		const { cart, product } = await Carts.deleteProduct(id, idProd);

		if (cart && product) {
			res.json(product);
		} else if (!cart) {
			res.json({ error: "There's no cart with that id." });
		} else {
			res.json({ error: "There's no product with that id." });
		}
	} catch (error) {
		res.json({ error: "Error while removing product from cart.", description: error.message });
	}
});

//EXPORTS
exports.router = router;
