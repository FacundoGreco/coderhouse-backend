import admin from "firebase-admin";
import { readFile } from "fs/promises";

const serviceAccount = JSON.parse(
	await readFile(
		new URL("../../db/coderhouse-backend-778dd-firebase-adminsdk-awr17-7f5feff86f.json", import.meta.url)
	)
);

admin.initializeApp({ credential: admin.credential.cert(serviceAccount) });
const db = admin.firestore();
const collection = db.collection("products");

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
			const products = [];
			const snapshot = await collection.get();

			snapshot.forEach((product) => products.push({ ...product.data() }));
			console.log("Products sent.");

			return products;
		} catch (error) {
			console.log(error.message);
			throw error;
		}
	}

	static async getProductById(id) {
		try {
			const snapshot = await collection.where("id", "==", id).get();
			const result = [];
			snapshot.forEach((product) => result.push(product.data()));

			const product = result[0];

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

	static async getProductDoc(id) {
		const snapshot = await collection.where("id", "==", id).get();
		const result = [];
		snapshot.forEach((product) => result.push(product.data()));

		return { ref: snapshot.docs[0].ref, product: result[0] };
	}

	static async updateProduct(id, props) {
		try {
			const { ref, product } = await this.getProductDoc(id);

			if (product) {
				const updatedProduct = { ...product, ...props };

				await ref.update({ ...props });
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
			const { ref, product } = await this.getProductDoc(id);

			if (product) {
				await ref.delete();
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

			await collection.add({ ...this });
			console.log("Product saved.");

			return this;
		} catch (error) {
			console.log(error.message);
			throw error;
		}
	}
}

export default Products;
