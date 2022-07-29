const db = require("../config/database");

Number.prototype.toFixedNumber = function (digits) {
	var pow = Math.pow(10, digits);
	return Math.round(this * pow) / pow;
}

class Rates {
	constructor() {

	}

	static async get() {
		const data = await Rates.conn.all(`SELECT cur_from as 'from', cur_to as 'to', cur_forward as 'forward', cur_back as 'reverse', cur_timestamp as timestamp FROM rates group by cur_from, cur_to having cur_timestamp = max(cur_timestamp)`);
		const currencies = [...new Set([...data.map(i => i.from), ...data.map(i => i.to)])];
		const rates = data.reduce((acc, cur) => {
			acc[cur.from][cur.to] = (cur.forward + 0.01 * Math.random()).toFixedNumber(4);
			acc[cur.to][cur.from] = (cur.reverse + 0.01 * Math.random()).toFixedNumber(4);
			return acc;
		}, currencies.reduce((acc, cur) => {
			acc[cur] = {};
			return acc;
		}, {}));
		const result = {
			currencies: currencies,
			rates: currencies.map(i => currencies.map(j => rates[i][j])),
		};

		return result;
	}

	static async CreateSchema() {
		Rates.conn = await db.connect();
		// Creating rates table if needed
		await Rates.conn.run('CREATE TABLE IF NOT EXISTS rates (cur_from TEXT NOT NULL, cur_to TEXT NOT NULL, cur_timestamp datetime NOT NULL DEFAULT CURRENT_TIMESTAMP, cur_forward REAL NOT NULL DEFAULT 1, cur_back REAL NOT NULL DEFAULT 1)');
		await Rates.conn.run('CREATE INDEX IF NOT EXISTS idx_rates on rates (cur_from, cur_to, cur_timestamp)');
	}
};

module.exports = Rates;