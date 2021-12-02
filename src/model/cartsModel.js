import fs from "fs";

class Carts {
	static #filePath = "src/db/carts.json";

	constructor() {
		this.products = [];
	}

	static async getCarts() {
		try {
			const carts = await fs.promises.readFile(Carts.#filePath);
			console.log("Products sent.");

			return JSON.parse(carts);
		} catch (error) {
			console.log(error.message);
			throw error;
		}
	}

	static async getCartById(id) {
		try {
			const carts = await Carts.getCarts();
			const cart = carts.find((cart) => cart.id === id);

			if (cart) {
				console.log("Cart found.");
				return cart;
			} else {
				console.log("There's no cart with that id.");
				return null;
			}
		} catch (error) {
			console.log(error.message);
			throw error;
		}
	}

	static async getCartProducts(id) {
		try {
			const cart = await Carts.getCartById(id);

			if (cart) {
				console.log("Cart products sent.");
				return cart.products;
			} else {
				console.log("There's no cart with that id.");
				return null;
			}
		} catch (error) {
			console.log(error.message);
			throw error;
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
				return product;
			} else {
				console.log("There's no cart with that id.");
				return null;
			}
		} catch (error) {
			console.log(error.message);
			throw error;
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
				const product = cart.products.find((product) => product.id === idProd);

				if (product) {
					cart.products = cart.products.filter((prod) => prod !== product);

					carts[index] = cart;

					await fs.promises.writeFile(Carts.#filePath, JSON.stringify(carts));
					console.log("Product deleted.");

					return { cart: cart, product: product };
				} else {
					console.log("There's no product with that id.");
					return { cart: cart, product: null };
				}
			} else {
				console.log("There's no cart with that id.");
				return { cart: null, product: undefined };
			}
		} catch (error) {
			console.log(error.message);
			throw error;
		}
	}

	static async deleteCart(id) {
		try {
			let carts = await Carts.getCarts();
			const cart = carts.find((cart) => cart.id === id);

			if (cart) {
				carts = carts.filter((ct) => ct !== cart);

				await fs.promises.writeFile(Carts.#filePath, JSON.stringify(carts));
				console.log("Cart deleted.");

				return cart;
			} else {
				console.log("There's no cart with that id.");
				return null;
			}
		} catch (error) {
			console.log(error.message);
			throw error;
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
			return this;
		} catch (error) {
			console.log(error.message);
			throw error;
		}
	}
}

export { Carts };
