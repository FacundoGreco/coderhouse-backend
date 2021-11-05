const fs = require("fs");
const { Router } = require("express");
const router = new Router();

//MIDDLEWARES
function validateMessage(req, res, next) {
	const { email, message } = req.body;
	if (!email || !message) return res.status(406).json({ error: "Invalid message." });
	else next();
}

//HELPER FUNCTIONS
async function getMessages() {
	let messages = null;
	try {
		messages = await fs.promises.readFile("./src/db/messages.json");
		messages = JSON.parse(messages);
	} catch (err) {
		console.log(err);
	}
	return messages;
}

//ROUTES
//------------- GET HANDLING --------------------------------------//
router.get("/", async (req, res) => {
	const messages = await getMessages();

	res.json(messages);
});

//------------- POST HANDLING -------------------------------------//
router.post("/", validateMessage, async (req, res) => {
	const messages = await getMessages();

	if (messages != null) {
		const newMessage = { ...req.body };
		messages.push(newMessage);

		try {
			await fs.promises.writeFile("./sc/db/messages.json", JSON.stringify(messages));

			const { io } = require("./server");
			io.sockets.emit("loadMessages", messages);

			res.send(newMessage);
		} catch (error) {
			console.log(error);
			res.send("No se pudo cargar el mensaje.");
		}
	} else {
		res.send("No se pudo enviar el mensaje.");
	}
});

exports.router = router;
exports.getMessages = getMessages;
