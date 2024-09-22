import { knex } from "knex";
const config = require("./knexfile");

const allowedEnvs = ["test", "development", "production"];
const nodeEnv = process.env.NODE_ENV;

const environment =
	allowedEnvs.find((env: string) => env === nodeEnv) || "development";

const database = knex(config[environment]);

export default database;
