const fs = require("fs");

class Container {
	constructor(fileName) {
		this.fileName = fileName;
	}

	async getAll() {
		try {
			const fileData = await fs.promises.readFile(this.fileName);
			return JSON.parse(fileData);
		} catch (error) {
			console.log(error.message);
			return [];
		}
	}

	async getNewId(fileData) {
		return fileData.length > 0 ? fileData[fileData.length - 1].id + 1 : 1;
	}

	async save(object) {
		try {
			const fileData = await this.getAll();
			object.id = await this.getNewId(fileData);
			fileData.push(object);

			await fs.promises.writeFile(this.fileName, JSON.stringify(fileData));
			console.log("Object saved.");

			return object.id;
		} catch (error) {
			console.log(error.message);
		}
	}

	async getById(id) {
		try {
			const fileData = await this.getAll();
			const object = fileData.find((object) => object.id === id);

			return object || null;
		} catch (error) {
			console.log(error.message);
		}
	}

	async deleteById(id) {
		try {
			let fileData = await this.getAll();
			if (fileData.some((object) => object.id === id)) {
				fileData = fileData.filter((object) => object.id !== id);

				await fs.promises.writeFile(this.fileName, JSON.stringify(fileData));
				console.log("Object deleted.");
			} else {
				console.log("There's no object with that id.");
			}
		} catch (error) {
			console.log(error.message);
		}
	}

	async deleteAll() {
		try {
			await fs.promises.unlink(this.fileName);
			console.log("File deleted.");
		} catch (error) {
			console.log(error.message);
		}
	}

	async getRandomProduct() {
		const products = await this.getAll();
		const maxId = products.length;

		if (maxId) {
			const randomId = parseInt(Math.random() * maxId + 1);
			const randomProduct = await this.getById(randomId);

			return randomProduct;
		} else {
			return "There are no products.";
		}
	}
}

module.exports = { Container };
