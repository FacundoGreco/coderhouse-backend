const { options: mysqlOptions } = require("../db/options/mysql.js");
const { options: sqlite3Options } = require("../db/options/sqlite3.js");
const knexLib = require("knex");

async function createTables() {
	//PRODUCTS TABLE
	let knex = knexLib(sqlite3Options);

	try {
		const existsProducts = await knex.schema.hasTable("products");

		if (!existsProducts) {
			try {
				await knex.schema.createTable("products", (table) => {
					table.increments("id");
					table.string("title");
					table.integer("price");
					table.string("imageUrl");
				});

				console.log("TABLE PRODUCTS CREATED");
			} catch (error) {
				console.log("Error creating products table.");
			}
		}
	} catch (error) {
		console.log("Error checking products table.");
	} finally {
		knex.destroy();
	}

	//MESSAGES TABLE
	knex = knexLib(mysqlOptions);

	try {
		const existsMessages = await knex.schema.hasTable("messages");

		if (!existsMessages) {
			try {
				await knex.schema.createTable("messages", (table) => {
					table.increments("id");
					table.string("email");
					table.string("date");
					table.string("message");
				});

				console.log("TABLE MESSAGES CREATED");
			} catch (error) {
				console.log("Error creating messages table.");
			}
		}
	} catch (error) {
		console.log("Error checking messages table.");
	} finally {
		knex.destroy();
	}
}

createTables();
