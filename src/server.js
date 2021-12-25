import express from "express";
const app = express();
import session from "express-session";
import MongoStore from "connect-mongo";

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
function validateSession(req, res, next) {
	if (req.session.name) {
		return next();
	}
	res.redirect("/login");
}

app.set("view engine", "ejs");
app.set("views", "./src/public/views");
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("./src/public"));
app.use(
	session({
		store: MongoStore.create({
			mongoUrl:
				"mongodb+srv://root:PkQ9aZqAlhtUHy3a@cluster0.1g2rb.mongodb.net/challenge-sessions?retryWrites=true&w=majority",
			mongoOptions: { useNewUrlParser: true, useUnifiedTopology: true },
		}),
		secret: "This is my secret word.",
		resave: false,
		saveUninitialized: false,
		rolling: true,
		cookie: { maxAge: 60000 * 10 },
	})
);

//HELPER FUNCTIONS
function renderIndex(req, res, fakerProducts, products, messages) {
	res.render("./pages/index", {
		session: { ...req.session },
		fakerProducts: fakerProducts,
		products: products,
		messages: messages,
	});
}

//ROUTES

//Auth
app.get("/login", (req, res) => {
	res.render("./pages/login");
});

app.get("/register", (req, res) => {
	res.render("./pages/register");
});

app.post("/login", (req, res) => {
	const { name } = req.body;

	if (name) {
		req.session.name = name;
	}
	res.redirect("/");
});

app.get("/logout", (req, res) => {
	if (!req.session.name) return res.redirect("/");

	const tempSession = { ...req.session };
	req.session.destroy();
	res.render("./pages/logout", { session: tempSession });
});

//Logged user endpoints
app.get("/", validateSession, (req, res) => {
	renderIndex(req, res, [], [], []);
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

export { io, validateSession };
