const mongoose = require("mongoose");

var dbConnected = false;

function connectDb(cb) {
	mongoose.connect(
		"mongodb+srv://root:PkQ9aZqAlhtUHy3a@cluster0.1g2rb.mongodb.net/challenge-cluster?retryWrites=true&w=majority",
		{ useNewUrlParser: true, useUnifiedTopology: true },
		(err) => {
			if (!err) {
				dbConnected = true;
			}
			if (cb != null) {
				cb(err);
			}
		}
	);
}

const User = mongoose.model("Users", {
	username: String,
	password: String,
});

exports = { connectDb, User };
