import { productsCollection as collection } from "./mongoDB.js";
class Products {
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
			const products = await collection.find().toArray();
			console.log("Products sent.");

			return products;
		} catch (error) {
			console.log(error.message);
			throw error;
		}
	}

	static async getProductById(id) {
		try {
			const query = await collection.find({ id: id }).limit(1).toArray();
			const product = query[0];

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
			const product = await this.getProductById(id);

			if (product) {
				const updatedProduct = { ...product, ...props };

				await collection.updateOne({ id: id }, { $set: { ...props } });
				console.log("Product updated.");
				return updatedProduct;
			} else {
				return null;
			}
		} catch (error) {
			console.log(error.message);
			throw error;
		}
	}

	static async deleteProduct(id) {
		try {
			const product = await this.getProductById(id);

			if (product) {
				await collection.deleteOne({ id: id });
				console.log("Product deleted.");

				return product;
			} else {
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

			await collection.insertOne(this);
			console.log("Product saved.");

			return this;
		} catch (error) {
			console.log(error.message);
			throw error;
		}
	}
}

export default Products;
