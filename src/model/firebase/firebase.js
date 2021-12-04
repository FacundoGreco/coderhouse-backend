import admin from "firebase-admin";
import { readFile } from "fs/promises";

const serviceAccount = JSON.parse(
	await readFile(
		new URL("../../db/coderhouse-backend-778dd-firebase-adminsdk-awr17-7f5feff86f.json", import.meta.url)
	)
);

admin.initializeApp({ credential: admin.credential.cert(serviceAccount) });
const db = admin.firestore();

const productsCollection = db.collection("products");
const cartsCollection = db.collection("carts");

export { productsCollection, cartsCollection };
