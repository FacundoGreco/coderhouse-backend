const express = require("express");
const app = express();
const SERVER_MODE = process.env.SERVER_MODE;
console.log(SERVER_MODE);
console.log("PORT", process.argv[2]);

const PORT = parseInt(process.argv[2]) || 8080;

app.get("/", (req, res) => {
	res.send(`PORT: ${PORT} - PID WORKER: ${process.pid}`);
});

const server = app.listen(PORT, () => console.log("asdas"));

server.on("error", (err) => console.log(err.message));
