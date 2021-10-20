const { Router } = require("express");
const router = new Router();
const products = [];

// router.get("/", (req, res) => {
// 	res.send(products);
// });

// router.get("/randomProduct", async (req, res) => {
// 	const randomProduct = await container.getRandomProduct();

// 	res.send(randomProduct);
// });

exports.router = router;
