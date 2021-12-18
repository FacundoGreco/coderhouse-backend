import { Router } from "express";
const router = new Router();
import { validateSession } from "../server.js";

//MODEL
import { MessagesModel } from "../model/MessagesModel.js";
import { messagesCollection } from "../db/options/mongoDB.js";
const model = new MessagesModel(messagesCollection);

//MIDDLEWARES
function validateMessage(req, res, next) {
	const { author, message, date } = req.body;
	const { id, name, surname, age, alias } = author;
	if (!id || !name || !surname || !age || !alias || !message || !date)
		return res.status(406).json({ error: "Invalid message." });
	else next();
}

//HELPER FUNCTIONS
async function emitLoadMessages() {
	try {
		const messages = await model.getMessagesAll();

		const { io } = await import("../server.js");
		io.sockets.emit("loadMessages", messages);
	} catch (error) {
		console.log(error.message);
	}
}

//ROUTES
//------------- GET HANDLING --------------------------------------//
router.get("/", validateSession, async (req, res) => {
	try {
		const messages = await model.getMessagesAll();

		res.json(messages);
	} catch (error) {
		res.status(500).json({ error: "Error while getting messages.", description: error.message });
	}
});

//------------- POST HANDLING -------------------------------------//
router.post("/", validateSession, validateMessage, async (req, res) => {
	try {
		const newMessage = await model.insertMessage(req.body);

		res.json(newMessage);

		await emitLoadMessages();
	} catch (error) {
		res.status(500).json({ error: "Error while inserting new message.", description: error.message });
	}
});

export { router };
