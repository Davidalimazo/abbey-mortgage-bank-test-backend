const dotenv = require("dotenv");
require("dotenv").config({ path: "../../.env" });

dotenv.config();

const { DATABASE_URL, DATABASE_URL_DEV, DATABASE_URL_TEST } = process.env;

module.exports = {
	test: {
		client: "postgresql",
		connection: DATABASE_URL_TEST,
	},

	development: {
		client: "postgresql",
		connection: DATABASE_URL_DEV,
		pool: {
			min: 2,
			max: 10,
		},
		migrations: {
			directory: "./migrations",
			tableName: "knex_migrations",
		},
		seeds: {
			directory: "./seeds",
		},
	},

	production: {
		client: "postgresql",
		connection: {
			connectionString: DATABASE_URL,
			ssl: {
				rejectUnauthorized: false,
			},
		},
		pool: {
			min: 2,
			max: 10,
		},
		migrations: {
			directory: "./src/database/migrations",
			tableName: "knex_migrations",
		},
		seeds: {
			directory: "./src/database/seeds",
		},
	},
};
