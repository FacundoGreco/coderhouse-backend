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
	// case "firebase":
	// 	const { default: PersonasDaoFirebase } = await import("./PersonasDaoFirebase.js");
	// 	personasDao = new PersonasDaoFirebase();
	// 	break;
	// case "mongodb":
	// 	const { default: PersonasDaoMongoDb } = await import("./PersonasDaoMongoDb.js");
	// 	personasDao = new PersonasDaoMongoDb();
	// 	break;
	// default:
	// 	const { default: PersonasDaoMem } = await import("./PersonasDaoMem.js");
	// 	personasDao = new PersonasDaoMem();
	// 	break;
}

export { ProductsDao, CartsDao };
