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
async function deleteProduct(e) {
	const productCard = e.target.parentNode.parentNode;
	const id = productCard.querySelector(".productId").textContent.replace("ID: ", "");

	const response = await fetch(`api/products/${id}`, { method: "DELETE" });

	console.log(response);
}

addEventListenerByQuery(".deleteProductBtn", "click", deleteProduct);
