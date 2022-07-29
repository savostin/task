const db = require("../config/database");
const randToken = require('rand-token');

class User {
	constructor() {

	}

	static async findOne(fields) {
		return await User.conn.get(`SELECT * FROM users WHERE ${Object.keys(fields).map((i) => `${i} = ?`).join(' AND ')}`, Object.values(fields));
	}

	static async create(fields) {
		// filling default data
		let data = {
			...{
				first_name: '?',
				last_name: '?',
				email: '?',
				password: '?',
			},
			...fields,
			...{
				refresh_token: randToken.uid(256)
			}
		};
		// inserting to db
		let res = await User.conn.run(`INSERT INTO users (${Object.keys(data).join(', ')}) values (${Object.keys(data).map((i) => `?`).join(', ')})`, Object.values(data));
		return { ...data, id: res.lastID };
	}

	static async CreateSchema() {
		User.conn = await db.connect();
		// Creating users table if needed
		await User.conn.run('CREATE TABLE IF NOT EXISTS users (id INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT, first_name TEXT NOT NULL, last_name TEXT NOT NULL, email TEXT NOT NULL, password TEXT NOT NULL, registered datetime NOT NULL DEFAULT CURRENT_TIMESTAMP, refresh_token TEXT NOT NULL)');
		await User.conn.run('CREATE UNIQUE INDEX IF NOT EXISTS users_idx_email on users (email)');
		await User.conn.run('CREATE INDEX IF NOT EXISTS users_idx_password on users (password)');
	}
};

module.exports = User;