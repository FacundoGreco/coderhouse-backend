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
