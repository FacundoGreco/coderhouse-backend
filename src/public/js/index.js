const socket = io();
const productsTableContainer = document.querySelector(".productsTableContainer");
const form = document.querySelector(".addProductForm");
const messageCenter = document.querySelector(".messageCenter");
const sendMessage = messageCenter.querySelector(".sendMessage");
const emailInput = messageCenter.querySelector("#email");
const messageInput = messageCenter.querySelector("#message");
const sendButton = messageCenter.querySelector(".sendButton");

//-----------------SOCKETS---------------------//

//ON LOAD PRODUCTS
socket.on("loadProducts", async (products) => {
	//Removes old table
	let oldProductsTable = productsTableContainer.querySelector(".productsTable");
	productsTableContainer.removeChild(oldProductsTable);

	//Fetches productsTable and compiles it
	const productsTableFile = await fetch("views/partials/products/productsTable.ejs");
	const productsTableEjs = await productsTableFile.text();

	//Renders table
	const productsTable = ejs.render(productsTableEjs, { products: products });
	productsTableContainer.innerHTML += productsTable;
});

//ON LOAD MESSAGES
socket.on("loadMessages", async (messages) => {
	if (!messages) {
		emailInput.disabled = true;
		sendButton.disabled = true;
	}

	//Removes old chat
	let oldChat = messageCenter.querySelector(".chat");
	messageCenter.removeChild(oldChat);

	//Fetches chat and compiles it
	const chatFile = await fetch("views/partials/messages/chat.ejs");
	const chatEjs = await chatFile.text();

	const chat = ejs.render(chatEjs, { messages: messages });
	const wrapper = document.createElement("div");
	wrapper.innerHTML = chat;

	//Renders chat
	const chatNode = wrapper.firstChild;

	messageCenter.insertBefore(chatNode, sendMessage);
});

//-----------------FORM CONTROL---------------------//
//LOAD PRODUCTS

//ON SUBMIT ADD PRODUCT
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

//MESSAGE CENTER

//ON CHANGE EMAIL
emailInput.addEventListener("change", (e) => {
	if (emailInput.value != "") {
		messageInput.disabled = false;
		sendButton.disabled = false;
	} else {
		messageInput.disabled = true;
		sendButton.disabled = true;
	}
});

//GET FORMATTED DATE
function getFormattedDate() {
	const date = new Date();
	const formattedDate = `${date.getDate()}/${
		date.getMonth() + 1
	}/${date.getFullYear()} ${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}`;

	return formattedDate;
}

//ON SEND MESSAGE
sendButton.addEventListener("click", async (e) => {
	e.preventDefault();

	//Get input values
	const email = emailInput.value;
	const date = getFormattedDate();
	const message = messageInput.value;
	const newMessage = { email: email, date: date, message: message };

	try {
		//Post new product
		await fetch("/api/chat/", {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify(newMessage),
		});

		//Reset message input values
		messageInput.value = "";
	} catch (err) {
		console.log(err);
	}
});
