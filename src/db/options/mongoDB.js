import { MongoClient } from "mongodb";
const uri =
	"mongodb+srv://root:PkQ9aZqAlhtUHy3a@cluster0.1g2rb.mongodb.net/myFirstDatabase?retryWrites=true&w=majority";
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

await client.connect();

const messagesCollection = client.db("challenge-normalization").collection("messages");

export { messagesCollection };
