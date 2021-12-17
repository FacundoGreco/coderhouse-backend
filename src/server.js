import express from "express";
const app = express();
import { router as productsRouter } from "./routers/productsApi.js";
import { router as chatRouter } from "./routers/chatApi.js";
import { getFakerProducts } from "./model/fakerProducts.js";

//MODELS
import { Container } from "./model/Container.js";
import { MessagesModel } from "./model/MessagesModel.js";

import { options as sqlite3Options } from "./db/options/sqlite3.js";
const sqlite3Model = new Container(sqlite3Options, "products");

import { messagesCollection } from "./db/options/mongoDB.js";
const mongoModel = new MessagesModel(messagesCollection);

//MIDDLEWARES
app.set("view engine", "ejs");
app.set("views", "./src/public/views");
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("./src/public"));

//ROUTES
app.get("/", (req, res) => {
	res.render("./pages/index", {
		session: { name: "Test Name" },
		fakerProducts: [],
		products: [],
		messages: [],
	});
});

app.get("/logout", (req, res) => {
	let session = { name: "Test Name" };

	res.render("./pages/logout", { session });
});

app.get("/api/faker/products", (req, res) => {
	res.json(getFakerProducts());
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
import { Server as IOServer } from "socket.io";
const io = new IOServer(server);

io.on("connection", async (socket) => {
	console.log("User connected...");

	//Fetch fakerProducts
	const fakerProducts = getFakerProducts();

	//Fetch products
	const products = await sqlite3Model.getElementsAll();

	//Fetch messages
	const messages = await mongoModel.getMessagesAll();

	socket.emit("loadFakerProducts", fakerProducts);
	socket.emit("loadProducts", products);
	socket.emit("loadMessages", messages);
});

export { io };
