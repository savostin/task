const { PromisedDatabase } = require('promised-sqlite3');

const sqlite3 = new PromisedDatabase();

const { DB_FILE } = process.env;
const db_file = DB_FILE || 'db.db';

module.exports.connect = async () => {
	// Connecting to the database
	await sqlite3.open(db_file);
	console.log("Successfully connected to database");
	return sqlite3;
}