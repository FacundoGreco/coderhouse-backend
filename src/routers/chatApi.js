const { Router } = require("express");
const router = new Router();

//MODEL
const Container = require("../model/Container");
const { options } = require("../db/options/mysql");
const model = new Container(options, "messages");

//MIDDLEWARES
function validateMessage(req, res, next) {
	const { email, message } = req.body;
	if (!email || !message) return res.status(406).json({ error: "Invalid message." });
	else next();
}

//HELPER FUNCTIONS
async function emitLoadMessages() {
	try {
		const messages = await model.getElementsAll();

		const { io } = require("../server");
		io.sockets.emit("loadMessages", messages);
	} catch (error) {
		console.log(error.message);
	}
}

//ROUTES
//------------- GET HANDLING --------------------------------------//
router.get("/", async (req, res) => {
	try {
		const messages = await model.getElementsAll();

		res.json(messages);
	} catch (error) {
		res.status(500).json({ error: "Error while getting messages.", description: error.message });
	}
});

//------------- POST HANDLING -------------------------------------//
router.post("/", validateMessage, async (req, res) => {
	try {
		const newMessage = await model.insertElement(req.body);

		res.json(newMessage);

		await emitLoadMessages();
	} catch (error) {
		res.status(500).json({ error: "Error while inserting new message.", description: error.message });
	}
});

exports.router = router;
