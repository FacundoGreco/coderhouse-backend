const express = require("express");
const app = express();

const PORT = 8080;

//ROUTES
app.get("/", (req, res) => {
	res.send("<h1 style= 'color: blue'>Welcome to the express server.</h1>");
});

let visits = 0;
app.get("/visits", (req, res) => {
	visits++;
	res.send(`<h1>The quantity of visits are: ${visits}</h1>`);
});

app.get("/date", (req, res) => {
	const date = new Date().toString();
	res.send({ date: date });
});

//START SERVER
const server = app.listen(PORT, () => {
	console.log(`Server on port ${server.address().port}`);
});

server.on("error", (err) => console.log(`Error in server: ${err}`));
