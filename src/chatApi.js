const { Router } = require("express");
const router = new Router();
let messages = [];

//MIDDLEWARES
function validateMessage(req, res, next) {
	const { email, message } = req.body;
	if (!email || !message) return res.status(406).json({ error: "Invalid message." });
	else next();
}

//ROUTES
//------------- GET HANDLING --------------------------------------//
router.get("/", (req, res) => {
	res.json(messages);
});

//------------- POST HANDLING -------------------------------------//
router.post("/", validateMessage, (req, res) => {
	const newMessage = { ...req.body };
	messages.push(newMessage);

	const { io } = require("./server");
	io.sockets.emit("loadMessages", messages);

	res.send(newMessage);
});

exports.router = router;
exports.messages = messages;
