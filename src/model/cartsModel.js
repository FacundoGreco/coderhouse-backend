const fs = require("fs");

class Carts {
	static #filePath = "src/db/carts.json";

	constructor() {
		this.products = [];
	}

	static async getCarts() {
		try {
			const carts = await fs.promises.readFile(Carts.#filePath);
			return JSON.parse(carts);
		} catch (error) {
			console.log(error.message);
			return [];
		}
	}

	static async getCartById(id) {
		try {
			const carts = await Carts.getCarts();
			const cart = carts.find((cart) => cart.id === id);

			if (cart) {
				return cart;
			} else {
				console.log("There's no cart with that id.");
				return null;
			}
		} catch (error) {
			console.log(error.message);
			return null;
		}
	}

	static async getCartProducts(id) {
		try {
			const cart = await Carts.getCartById(id);
			const cartProducts = cart ? cart.products : null;

			return cartProducts;
		} catch (error) {
			console.log(error.message);
			return [];
		}
	}

	static async addProduct(id, product) {
		try {
			const carts = await Carts.getCarts();
			let index;
			const cart = carts.find((cart, i) => {
				index = i;
				return cart.id === id;
			});

			if (cart) {
				cart.products.push(product);
				carts[index] = cart;

				await fs.promises.writeFile(Carts.#filePath, JSON.stringify(carts));
				console.log("Product added.");
			} else {
				console.log("There's no cart with that id.");
			}
		} catch (error) {
			console.log(error.message);
		}
	}

	static async deleteProduct(id, idProd) {
		try {
			const carts = await Carts.getCarts();
			let index;
			const cart = carts.find((cart, i) => {
				index = i;
				return cart.id === id;
			});

			if (cart) {
				if (cart.products.some((product) => product.id === idProd)) {
					cart.products = cart.products.filter((product) => product.id !== idProd);

					carts[index] = cart;

					await fs.promises.writeFile(Carts.#filePath, JSON.stringify(carts));
					console.log("Product deleted.");
				} else {
					console.log("There's no product with that id.");
				}
			} else {
				console.log("There's no cart with that id.");
			}
		} catch (error) {
			console.log(error.message);
		}
	}

	static async deleteCart(id) {
		try {
			let carts = await Carts.getCarts();

			if (carts.some((cart) => cart.id === id)) {
				carts = carts.filter((cart) => cart.id !== id);

				await fs.promises.writeFile(Carts.#filePath, JSON.stringify(carts));
				console.log("Cart deleted.");
			} else {
				console.log("There's no cart with that id.");
			}
		} catch (error) {
			console.log(error.message);
		}
	}

	async getNewId(carts) {
		return carts.length > 0 ? carts[carts.length - 1].id + 1 : 1;
	}

	async setLastProps(carts) {
		this.id = await this.getNewId(carts);
		this.timestamp = Date.now();
	}

	async saveCart() {
		try {
			const carts = await Carts.getCarts();
			await this.setLastProps(carts);
			carts.push(this);

			await fs.promises.writeFile(Carts.#filePath, JSON.stringify(carts));
			console.log("Cart saved.");
		} catch (error) {
			console.log(error.message);
		}
	}
}

exports.Carts = Carts;
