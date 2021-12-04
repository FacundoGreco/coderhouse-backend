import config from "../config.js";
let ProductsDao;
let CartsDao;

switch (config.STORAGE) {
	case "files":
		const { default: ProductsDaoFiles } = await import("./files/productsDaoFiles.js");
		ProductsDao = ProductsDaoFiles;
		const { default: CartsDaoFiles } = await import("./files/cartsDaoFiles.js");
		CartsDao = CartsDaoFiles;
		break;

	case "memory":
		const { default: ProductsDaoMemory } = await import("./memory/productsDaoMemory.js");
		ProductsDao = ProductsDaoMemory;
		const { default: CartsDaoMemory } = await import("./memory/cartsDaoMemory.js");
		CartsDao = CartsDaoMemory;
		break;

	case "mongoDB":
		const { default: ProductsDaoMongoDB } = await import("./mongoDB/productsDaoMongoDB.js");
		ProductsDao = ProductsDaoMongoDB;
		const { default: CartsDaoMongoDB } = await import("./mongoDB/cartsDaoMongoDB.js");
		CartsDao = CartsDaoMongoDB;
		break;

	case "firebase":
		const { default: ProductsDaoFirebase } = await import("./firebase/productsDaoFirebase.js");
		ProductsDao = ProductsDaoFirebase;
		const { default: CartsDaoFirebase } = await import("./firebase/cartsDaoFirebase.js");
		CartsDao = CartsDaoFirebase;
		break;
}

export { ProductsDao, CartsDao };
