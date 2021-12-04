import Products from "../../model/mongoDB/productsModelMongoDB.js";

class ProductsDaoMongoDB extends Products {
	constructor(name, description, code, imgURL, price, stock) {
		super(name, description, code, imgURL, price, stock);
	}
}

export default ProductsDaoMongoDB;
