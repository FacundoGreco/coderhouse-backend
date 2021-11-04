const express = require("express");
const app = express();
const { router: productsRouter } = require("./productsApi.js");
const { router: chatRouter } = require("./chatApi.js");
// const { Server: HttpServer } = require("http");
// const httpServer = new HttpServer(app);

let { products } = require("./productsApi");
let { messages } = require("./chatApi");

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

io.on("connection", (socket) => {
	console.log("User connected...");

	socket.emit("loadProducts", products);
	socket.emit("loadMessages", messages);
});

exports.io = io;
