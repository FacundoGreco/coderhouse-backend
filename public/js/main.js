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
function getProductId(e) {
	const productCard = e.target.parentNode.parentNode;
	const id = productCard.querySelector(".productId").textContent.replace("ID: ", "");

	return id;
}

async function deleteProduct(e) {
	const id = getProductId(e);

	const response = await fetch(`api/products/${id}`, { method: "DELETE" });

	console.log(response);
}

async function saveProductChanges(e) {
	e.preventDefault();

	const product = {};
	const id = getProductId(e);

	const editProductModal = e.target.parentNode.parentNode;
	editProductModal.querySelectorAll(".form-group input").forEach((input) => (product[input.id] = input.value));

	const response = await fetch(`api/products/${id}`, {
		method: "PUT",
		mode: "cors",
		headers: {
			"Content-Type": "application/json",
		},
		body: JSON.stringify(product),
	});

	console.log(response);
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

addEventListenerByQuery(".deleteProductBtn", "click", deleteProduct);
addEventListenerByQuery(".editProductBtn", "click", editProduct);
