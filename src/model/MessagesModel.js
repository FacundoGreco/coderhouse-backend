import { normalize, schema } from "normalizr";

//NORMALIZR SCHEMA
const authorSchema = new schema.Entity("authors");
const messageSchema = new schema.Entity("messages", { author: authorSchema }, { idAttribute: "_id" });
const messagesSchema = [messageSchema];

class MessagesModel {
	constructor(collection) {
		this.collection = collection;
	}

	async getMessagesAll() {
		try {
			const messages = await this.collection.find().toArray();
			const normalizedMessages = normalize(messages, messagesSchema);

			console.log("Messages sent.");

			return normalizedMessages;
		} catch (error) {
			console.log(error.message);
			throw error;
		}
	}

	async insertMessage(message) {
		try {
			await this.collection.insertOne(message);
			console.log("Message saved.");

			return { ...message };
		} catch (error) {
			console.log(error.message);
			throw error;
		}
	}
}

export { MessagesModel };
