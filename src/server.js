const parseArgs = require("minimist");
const args = parseArgs(process.argv.slice(2));
const path = require("path");
const { fileURLToPath } = require("url");
const dotenv = require("dotenv");
dotenv.config({ path: path.resolve(__dirname, "config.env") });

const express = require("express");
const app = express();
const session = require("express-session");
const MongoStore = require("connect-mongo");
const { passport } = require("./passport.js");
const { connectDb } = require("./db/options/mongoose.js");

const { router: productsRouter } = require("./routers/productsApi.js");
const { router: chatRouter } = require("./routers/chatApi.js");
const { router: infoRouter } = require("./routers/info.js");
const { router: randomsRouter } = require("./routers/randomsApi.js");
const { getFakerProducts } = require("./model/fakerProducts.js");

//CLUSTER
const cluster = require("cluster");
const os = require("os");
const numCPUs = os.cpus().length;
const { Server: IOServer } = require("socket.io");
let io;
const SERVER_MODE = process.env.SERVER_MODE;
console.log(SERVER_MODE);
//MODELS
const { Container } = require("./model/Container.js");
const { MessagesModel } = require("./model/MessagesModel.js");

const { options: sqlite3Options } = require("./db/options/sqlite3.js");
const sqlite3Model = new Container(sqlite3Options, "products");

const { messagesCollection } = require("./db/options/mongoDB.js");
const mongoModel = new MessagesModel(messagesCollection);

//MIDDLEWARES
function validateSession(req, res, next) {
	if (req.isAuthenticated()) {
		return next();
	}
	res.redirect("/login");
}

//HELPER FUNCTIONS
function renderIndex(req, res, fakerProducts, products, messages) {
	res.render("./pages/index", {
		user: req.user,
		fakerProducts: fakerProducts,
		products: products,
		messages: messages,
	});
}

/* ------------------------------------------------------------------------------ */
/* MASTER */
// if (cluster.isPrimary) {
// console.log(numCPUs);
// console.log(`PID MASTER ${process.pid}`);

// for (let i = 0; i < numCPUs; i++) {
// 	cluster.fork();
// }

// cluster.on("exit", (worker) => {
// 	console.log(`Worker ${worker.process.pid} died -> ${new Date().toLocaleDateString()}`);
// 	cluster.fork();
// });
// } else {
/* ------------------------------------------------------------------------------ */
/* WORKERS */

app.set("view engine", "ejs");
app.set("views", "./src/public/views");
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("./src/public"));
app.use(
	session({
		store: MongoStore.create({
			mongoUrl: process.env.MONGO_URL,
			mongoOptions: { useNewUrlParser: true, useUnifiedTopology: true },
		}),
		secret: process.env.SECRET,
		resave: false,
		saveUninitialized: false,
		rolling: true,
		cookie: { maxAge: Number(process.env.MAX_AGE) },
	})
);

app.use(passport.initialize());
app.use(passport.session());

//ROUTES

//Auth
app.get("/login", (req, res) => {
	if (req.isAuthenticated()) {
		return res.redirect("/");
	}

	res.render("./pages/login");
});

app.get("/register", (req, res) => {
	res.render("./pages/register");
});

//Error
app.get("/error-login", (req, res) => {
	res.render("./pages/errorLogin");
});

app.get("/error-register", (req, res) => {
	res.render("./pages/errorRegister");
});

//Post
app.post("/login", passport.authenticate("login", { failureRedirect: "/error-login" }), (req, res) => {
	res.redirect("/");
});

app.post("/register", passport.authenticate("register", { failureRedirect: "/error-register" }), (req, res) => {
	res.redirect("/");
});

app.get("/logout", validateSession, (req, res) => {
	const tempUser = req.user;
	req.logout();
	res.render("./pages/logout", { user: tempUser });
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
app.use("/info", infoRouter);
app.use("/api/randoms", randomsRouter);

//START SERVER
connectDb((err) => {
	if (err) return console.log("Error connecting to database: ", err);
	console.log("DATABASE CONNECTED");

	const PORT = parseInt(process.argv[2]) || 8080;

	const server = app.listen(PORT, () => {
		console.log(`Server on port ${server.address().port}`);
	});
	server.on("error", (err) => console.log(`Error in server: ${err}`));

	//WEBSOCKETS
	io = new IOServer(server);

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
});
// }
exports = { io, validateSession };
