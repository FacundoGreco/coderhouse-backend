import fs from "fs";
let products = [];

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

	static getProducts() {
		console.log("Products sent.");
		return [...products];
	}

	static getProductById(id) {
		const product = products.find((product) => product.id === id);

		if (product) {
			console.log("Product found.");
			return product;
		} else {
			console.log("There's no product with that id.");
			return null;
		}
	}

	static updateProduct(id, props) {
		let index;
		const product = products.find((product, i) => {
			index = i;
			return product.id === id;
		});

		if (product) {
			const updatedProduct = { ...product, ...props };

			const productsUpdated = [...products];
			productsUpdated[index] = updatedProduct;

			products = productsUpdated;
			console.log("Product updated.");
			return updatedProduct;
		} else {
			console.log("There's no product with that id.");
			return null;
		}
	}

	static deleteProduct(id) {
		const product = this.getProductById(id);

		if (product) {
			const productsUpdated = products.filter((prod) => prod !== product);

			products = productsUpdated;
			console.log("Product deleted.");

			return product;
		} else return null;
	}

	getNewId() {
		return products.length > 0 ? products[products.length - 1].id + 1 : 1;
	}

	setLastProps() {
		this.id = this.getNewId();
		this.timestamp = Date.now();
	}

	saveProduct() {
		this.setLastProps();
		const productsUpdated = [...products];
		productsUpdated.push(this);

		products = productsUpdated;
		console.log("Product saved.");

		return this;
	}
}

export default Products;
