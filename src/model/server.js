const express = require("express");
const app = express();
const { router } = require("./api.js");

//MIDDLEWARES

//ROUTES
app.use(express.static("./public"));
app.use("/api/products", router);

//START SERVER
const PORT = process.env.PORT || 8080;

const server = app.listen(PORT, () => {
	console.log(`Server on port ${server.address().port}`);
});

server.on("error", (err) => console.log(`Error in server: ${err}`));
