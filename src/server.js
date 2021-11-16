const express = require("express");
const app = express();
const { router: productsRouter } = require("./routers/productsApi.js");
const { router: chatRouter, getMessages } = require("./routers/chatApi.js");

let { products } = require("./routers/productsApi");

//MIDDLEWARES
app.set("view engine", "ejs");
app.set("views", "./src/public/views");
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("./src/public"));

//ROUTES
app.get("/", (req, res) => {
	res.render("./pages/index", {
		products: [],
		messages: [],
	});
});

app.use("/api/products", productsRouter);
app.use("/api/chat", chatRouter);

//START SERVER
const PORT = process.env.PORT || 8080;

const server = app.listen(PORT, () => {
	console.log(`Server on port ${server.address().port}`);
});
server.on("error", (err) => console.log(`Error in server: ${err}`));

//WEBSOCKETS
const { Server: IOServer } = require("socket.io");
const io = new IOServer(server);

io.on("connection", async (socket) => {
	console.log("User connected...");

	//Fetch messages
	const messages = await getMessages();

	socket.emit("loadProducts", products);
	socket.emit("loadMessages", messages);
});

exports.io = io;
