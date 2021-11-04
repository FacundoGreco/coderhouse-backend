const socket = io();
const productsTableContainer = document.querySelector(".productsTableContainer");
const messageCenterContainer = document.querySelector(".messageCenterContainer");
const form = document.querySelector(".addProductForm");

//ON LOAD PRODUCTS
socket.on("loadProducts", async (products) => {
	//Removes old table
	let oldProductsTable = productsTableContainer.querySelector(".productsTable");
	productsTableContainer.removeChild(oldProductsTable);

	//Fetches productsTable and compiles it
	const productsTableFile = await fetch("views/partials/productsTable.ejs");
	const productsTableEjs = await productsTableFile.text();

	//Renders table
	const productsTable = ejs.render(productsTableEjs, { products: products });
	productsTableContainer.innerHTML += productsTable;
});

//ON LOAD MESSAGES
socket.on("loadMessages", async (messages) => {
	console.log(messages);
	//Removes old messageCenter
	let oldmessageCenter = messageCenterContainer.querySelector(".messageCenter");
	messageCenterContainer.removeChild(oldmessageCenter);

	//Fetches messageCenter and compiles it
	const messageCenterFile = await fetch("views/partials/messageCenter.ejs");
	const messageCenterEjs = await messageCenterFile.text();

	//Renders table
	const messageCenter = ejs.render(messageCenterEjs, { messages: messages });
	messageCenterContainer.innerHTML += messageCenter;
});

//ON SUBMIT
form.addEventListener("submit", async (e) => {
	e.preventDefault();

	//Get input values
	const title = e.target.querySelector("#title").value;
	const price = e.target.querySelector("#price").value;
	const imageUrl = e.target.querySelector("#imageUrl").value;
	const newProduct = { title: title, price: price, imageUrl: imageUrl };

	try {
		//Post new product
		await fetch("/api/products/", {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify(newProduct),
		});

		//Reset input values
		form.reset();
	} catch (err) {
		console.log(err);
	}
});
