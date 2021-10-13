const http = require("http");

const server = http.createServer((req, res) => {
	const date = new Date();
	const hour = date.getHours();
	const minutes = date.getMinutes();
	let greet = "";

	if (hour >= 6 && hour < 13) {
		greet = "Good morning!";
	} else if (hour >= 13 && hour < 20) {
		greet = "Good afternoon!";
	} else {
		greet = "Good evening!";
	}

	res.end(`
    <h1>The current hour is ${hour}:${minutes}</h1>
    <h2>${greet}</h2>`);
});

const connectedServer = server.listen(8080, () => {
	console.log(`Server on port ${connectedServer.address().port}`);
});
