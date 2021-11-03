const express = require("express");
const app = express();
const { router } = require("./api.js");
// const { Server: HttpServer } = require("http");
// const httpServer = new HttpServer(app);

let { products } = require("./api");

//MIDDLEWARES
app.set("view engine", "ejs");
app.set("views", "./src/public/views");
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("./src/public"));

//ROUTES
app.get("/", (req, res) => {
	res.render("./pages/index", { products: [] });
});

app.use("/api/products", router);

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
});

exports.io = io;
