import { MongoClient } from "mongodb";
import config from "../../config.js";

const client = new MongoClient(config.mongoDB.uri, config.mongoDB.options);
await client.connect();
const collection = client.db(config.mongoDB.db).collection("carts");

class Carts {
	constructor() {
		this.products = [];
	}

	static async getCarts() {
		try {
			const carts = await collection.find().toArray();
			console.log("Carts sent.");

			return carts;
		} catch (error) {
			console.log(error.message);
			throw error;
		}
	}

	static async getCartById(id) {
		try {
			const query = await collection.find({ id: id }).limit(1).toArray();
			const cart = query[0];

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
				return null;
			}
		} catch (error) {
			console.log(error.message);
			throw error;
		}
	}

	static async addProduct(id, product) {
		try {
			const cart = await this.getCartById(id);

			if (cart) {
				cart.products.push(product);

				await collection.updateOne({ id: id }, { $set: { products: cart.products } });
				console.log("Product added.");
				return product;
			} else {
				return null;
			}
		} catch (error) {
			console.log(error.message);
			throw error;
		}
	}

	static async deleteProduct(id, idProd) {
		try {
			const cart = await this.getCartById(id);

			if (cart) {
				const product = cart.products.find((product) => product.id === idProd);

				if (product) {
					cart.products = cart.products.filter((prod) => prod !== product);

					await collection.updateOne({ id: id }, { $set: { products: cart.products } });
					console.log("Product deleted.");

					return { cart: cart, product: product };
				} else {
					console.log("There's no product with that id.");
					return { cart: cart, product: null };
				}
			} else {
				return { cart: null, product: undefined };
			}
		} catch (error) {
			console.log(error.message);
			throw error;
		}
	}

	static async deleteCart(id) {
		try {
			const cart = await this.getCartById(id);

			if (cart) {
				await collection.deleteOne({ id: id });
				console.log("Cart deleted.");

				return cart;
			} else {
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

			await collection.insertOne(this);
			console.log("Cart saved.");

			return this;
		} catch (error) {
			console.log(error.message);
			throw error;
		}
	}
}

export default Carts;
