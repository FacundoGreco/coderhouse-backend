import fs from "fs";
let carts = [];

class Carts {

	constructor() {
		this.products = [];
	}

	static getCarts() {
		return [...carts];
	}

	static getCartById(id) {
		const cart = carts.find((cart) => cart.id === id);

		if (cart) {
			console.log("Cart found.");
			return cart;
		} else {
			console.log("There's no cart with that id.");
			return null;
		}
	}

	static getCartProducts(id) {
		const cart = Carts.getCartById(id);

		if (cart) {
			console.log("Cart products sent.");
			return cart.products;
		} else {
			console.log("There's no cart with that id.");
			return null;
		}
	}

	static addProduct(id, product) {
		let index;
		const cart = carts.find((cart, i) => {
			index = i;
			return cart.id === id;
		});

		if (cart) {
			cart.products.push(product);
			const cartsUpdated = [...carts];
			cartsUpdated[index] = cart;

			carts = cartsUpdated;
			console.log("Product added.");
			return product;
		} else {
			console.log("There's no cart with that id.");
			return null;
		}
	}

	static deleteProduct(id, idProd) {
		let index;
		const cart = carts.find((cart, i) => {
			index = i;
			return cart.id === id;
		});

		if (cart) {
			const product = cart.products.find((product) => product.id === idProd);

			if (product) {
				cart.products = cart.products.filter((prod) => prod !== product);
				const cartsUpdated = [...carts];
				cartsUpdated[index] = cart;

				carts = cartsUpdated;
				console.log("Product deleted.");

				return { cart: cart, product: product };
			} else {
				console.log("There's no product with that id.");
				return { cart: cart, product: null };
			}
		} else {
			console.log("There's no cart with that id.");
			return { cart: null, product: undefined };
		}
	}

	static deleteCart(id) {
		const cart = this.getCartById(id);

		if (cart) {
			const cartsUpdated = carts.filter((ct) => ct !== cart);

			carts = cartsUpdated;
			console.log("Cart deleted.");

			return cart;
		} else return null;
	}

	getNewId() {
		return carts.length > 0 ? carts[carts.length - 1].id + 1 : 1;
	}

	setLastProps() {
		this.id = this.getNewId();
		this.timestamp = Date.now();
	}

	saveCart() {
		this.setLastProps();
		const cartsUpdated = [...carts];
		cartsUpdated.push(this);

		carts = cartsUpdated;
		console.log("Cart saved.");
		return this;
	}
}

export default Carts;
