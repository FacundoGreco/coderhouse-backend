const STORAGE = process.env.STORAGE || "files";

export default {
	STORAGE,
	mongoDB: {
		uri: "mongodb+srv://root:PkQ9aZqAlhtUHy3a@cluster0.1g2rb.mongodb.net/myFirstDatabase?retryWrites=true&w=majority",
		options: { useNewUrlParser: true, useUnifiedTopology: true },
		db: "coderhouse-backend",
	},
};
