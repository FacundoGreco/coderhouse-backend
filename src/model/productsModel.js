import fs from "fs";

class Products {
	static #filePath = "src/db/products.json";

	constructor(name, description, code, imgURL, price, stock) {
		this.name = name;
		this.description = description;
		this.code = code;
		this.imgURL = imgURL;
		this.price = price;
		this.stock = stock;
	}

	static async getProducts() {
		try {
			const products = await fs.promises.readFile(Products.#filePath);
			console.log("Products sent.");

			return JSON.parse(products);
		} catch (error) {
			console.log(error.message);
			throw error;
		}
	}

	static async getProductById(id) {
		try {
			const products = await Products.getProducts();
			const product = products.find((product) => product.id === id);

			if (product) {
				console.log("Product found.");
				return product;
			} else {
				console.log("There's no product with that id.");
				return null;
			}
		} catch (error) {
			console.log(error.message);
			throw error;
		}
	}

	static async updateProduct(id, props) {
		try {
			let products = await Products.getProducts();
			let index;
			const product = products.find((product, i) => {
				index = i;
				return product.id === id;
			});

			if (product) {
				const updatedProduct = { ...product, ...props };
				products[index] = updatedProduct;

				await fs.promises.writeFile(Products.#filePath, JSON.stringify(products));
				console.log("Product updated.");
				return updatedProduct;
			} else {
				console.log("There's no product with that id.");
				return null;
			}
		} catch (error) {
			console.log(error.message);
			throw error;
		}
	}

	static async deleteProduct(id) {
		try {
			let products = await Products.getProducts();
			const product = products.find((product) => product.id === id);

			if (product) {
				products = products.filter((prod) => prod !== product);

				await fs.promises.writeFile(Products.#filePath, JSON.stringify(products));
				console.log("Product deleted.");

				return product;
			} else {
				console.log("There's no product with that id.");
				return null;
			}
		} catch (error) {
			console.log(error.message);
			throw error;
		}
	}

	async getNewId(products) {
		return products.length > 0 ? products[products.length - 1].id + 1 : 1;
	}

	async setLastProps(products) {
		this.id = await this.getNewId(products || (await Products.getProducts()));
		this.timestamp = Date.now();
	}

	async saveProduct() {
		try {
			const products = await Products.getProducts();
			await this.setLastProps(products);
			products.push(this);

			await fs.promises.writeFile(Products.#filePath, JSON.stringify(products));
			console.log("Product saved.");

			return this;
		} catch (error) {
			console.log(error.message);
			throw error;
		}
	}
}

export { Products };