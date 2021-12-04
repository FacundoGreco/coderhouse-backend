import Products from "../../model/memory/productsModelMemory.js";

class ProductsDaoFiles extends Products {
	constructor(name, description, code, imgURL, price, stock) {
		super(name, description, code, imgURL, price, stock);
	}
}

export default ProductsDaoFiles;
