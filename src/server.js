import express from "express";
import path, { dirname } from "path";
import { fileURLToPath } from "url";
import { router as productsRouter } from "./routers/apiProducts.js";
import { router as cartsRouter } from "./routers/apiCarts.js";
import { Products } from "./model/productsModel.js";

const app = express();
const __dirname = dirname(fileURLToPath(import.meta.url));

//MIDDLEWARES
app.use(express.json());
app.use(express.static(path.join(__dirname, "../public")));
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "/views"));

//ROUTERS
app.use("/api/products", productsRouter);
app.use("/api/carts", cartsRouter);

//ROUTES
app.get("/", async (req, res) => {
	res.render("pages/index", { products: [], cartProducts: [] });
});

app.all("*", (req, res) => {
	res.status(404).json({ error: 404, descripción: `Route '${req.url}' and method '${req.method}' not implemented.` });
});

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

	//Fetch products
	const products = await Products.getProducts();
	socket.emit("loadProducts", products);
});

export { io };
