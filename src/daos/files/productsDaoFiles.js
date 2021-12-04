import Products from "../../model/files/productsModelFiles.js";

class ProductsDaoFiles extends Products {
	constructor(name, description, code, imgURL, price, stock) {
		super(name, description, code, imgURL, price, stock);
	}
}

export default ProductsDaoFiles;
