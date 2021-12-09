class MessagesModel {
	constructor(collection) {
		this.collection = collection;
	}

	async getMessagesAll() {
		try {
			const messages = await this.collection.find().toArray();
			console.log("Messages sent.");

			return messages;
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
