const socket = io();

//FUNCTIONS
function addEventListenerByQuery(query, event, fn) {
	let list = document.querySelectorAll(query);
	for (let i = 0, len = list.length; i < len; i++) {
		list[i].addEventListener(event, fn, false);
	}
}

//ADD PRODUCTS
const addProducts = document.querySelector(".addProducts");

async function addProduct(e) {
	e.preventDefault();

	const product = {};

	addProducts.querySelectorAll(".form-group input").forEach((input) => (product[input.id] = input.value));

	const response = await fetch("api/products", {
		method: "POST",
		mode: "cors",
		headers: {
			"Content-Type": "application/json",
		},
		body: JSON.stringify(product),
	});

	console.log(response);
}

addProducts.addEventListener("submit", addProduct);

//PRODUCTS LIST
const productsListContainer = document.querySelector(".productsListContainer");

socket.on("loadProducts", async (products) => {
	try {
		//Removes old ProductsList node
		const oldProductsList = productsListContainer.querySelector(".productsList");
		productsListContainer.removeChild(oldProductsList);

		//Fetches ProductsList and compiles it
		const ProductsListFile = await fetch("/partials/ProductsList.ejs");
		const ProductsListEjs = await ProductsListFile.text();

		//Renders ProductsList
		const ProductsList = ejs.render(ProductsListEjs, { products: products });
		productsListContainer.innerHTML += ProductsList;

		//Adds buttons listeners
		addEventListenerByQuery(".deleteProductBtn", "click", deleteProduct);
		addEventListenerByQuery(".editProductBtn", "click", editProduct);
	} catch (error) {
		console.log("Error while loading products list.");
	}
});

function getProductId(e) {
	const productCard = e.target.parentNode.parentNode;
	const id = productCard.querySelector(".productId").textContent.replace("ID: ", "");

	return id;
}

async function deleteProduct(e) {
	const id = getProductId(e);

	await fetch(`api/products/${id}`, { method: "DELETE" });
}

async function saveProductChanges(e) {
	e.preventDefault();

	const product = {};
	const id = getProductId(e);

	const editProductModal = e.target.parentNode.parentNode;
	editProductModal.querySelectorAll(".form-group input").forEach((input) => (product[input.id] = input.value));

	await fetch(`api/products/${id}`, {
		method: "PUT",
		mode: "cors",
		headers: {
			"Content-Type": "application/json",
		},
		body: JSON.stringify(product),
	});
}

async function editProduct(e) {
	//Gets product values
	const id = getProductId(e);
	const product = await fetch(`api/products/${id}`, { method: "GET" });

	//Creates modal
	const productCard = e.target.parentNode.parentNode;
	const modalContainer = document.createElement("div");
	modalContainer.classList = "modalContainer";

	//Fetches EditProductModal and compiles it
	const EditProductModalFile = await fetch("/partials/EditProductModal.ejs");
	const EditProductModalEjs = await EditProductModalFile.text();

	//Renders modal
	const EditProductModal = ejs.render(EditProductModalEjs, { product: await product.json(), id: id });
	modalContainer.innerHTML += EditProductModal;

	//Appends modal
	productCard.appendChild(modalContainer);

	//Adds save changes listener
	const saveProductChangesBtn = productCard.querySelector(".saveProductChangesBtn");
	saveProductChangesBtn.addEventListener("click", saveProductChanges);
}

//CART
const itemsSection = document.querySelector(".itemsSection");
let cartID;

async function getCartProducts(id) {
	try {
		const cartProducts = await fetch(`api/carts/${id}/products`, { method: "GET" });

		return await cartProducts.json();
	} catch (error) {
		console.log(error);
		throw error;
	}
}

async function loadCart() {
	cartID = JSON.parse(localStorage.getItem("cartID"));
	const cartProducts = await getCartProducts(cartID);

	if (!cartProducts.error) {
		try {
			//Removes old CartItemsList node
			const oldCartItemsList = itemsSection.querySelector(".cartItemsList");
			itemsSection.removeChild(oldCartItemsList);

			//Fetches CartItemsList and compiles it
			const CartItemsListFile = await fetch("/partials/CartItemsList.ejs");
			const CartItemsListEjs = await CartItemsListFile.text();

			//Renders cartItemsList
			const CartItemsList = ejs.render(CartItemsListEjs, { cartProducts: cartProducts });
			itemsSection.innerHTML += CartItemsList;

			//Adds remove item listener
			addEventListenerByQuery(".removeItem", "click", removeItem);
		} catch (error) {
			console.log("Error while getting cart products.");
		}
	} else {
		try {
			const response = await fetch("api/carts", {
				method: "POST",
				mode: "cors",
				headers: {
					"Content-Type": "application/json",
				},
			});

			const cart = await response.json();

			cartID = cart.id;
			localStorage.setItem("cartID", cart.id);

			await loadCart();
		} catch (error) {
			console.log(error);
			console.log("Error while creating new cart.");
		}
	}

	//Adds add item listener
	const addItemBtn = itemsSection.querySelector(".addItemBtn");
	addItemBtn.addEventListener("click", addItem);

	//Adds clean cart listener
	const cleanCartBtn = itemsSection.querySelector(".cleanCartBtn");
	cleanCartBtn.addEventListener("click", cleanCart);
}
(async () => await loadCart())();

async function addItem(e) {
	const prodID = e.target.parentNode.querySelector("#prodID").value;

	if (prodID === "") return;

	try {
		await fetch(`api/carts/${cartID}/products/${prodID}`, {
			method: "POST",
			mode: "cors",
			headers: {
				"Content-Type": "application/json",
			},
		});

		await loadCart();
	} catch (error) {
		console.log(error);
		console.log("Error while adding item.");
	}
}

async function removeItem(e) {
	const prodID = e.target.parentNode.querySelector(".prodID").innerHTML.replace("ID: ", "");
	try {
		await fetch(`api/carts/${cartID}/products/${prodID}`, { method: "DELETE" });
		await loadCart();
	} catch (error) {
		console.log(error);
		console.log("Error while removing item.");
	}
}

async function cleanCart(e) {
	try {
		localStorage.removeItem("cartID");
		await fetch(`api/carts/${cartID}`, { method: "DELETE" });
		await loadCart();
	} catch (error) {
		console.log(error);
		console.log("Error while cleaning cart.");
	}
}
