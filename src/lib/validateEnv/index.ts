import { cleanEnv, str, port, url } from "envalid";
import { config } from "dotenv";

config();

const customEnv = cleanEnv(process.env, {
	BASE_URL: str({ default: "" }),
	DB_USERNAME: str({ default: "" }),
	DB_PASSWORD: str({ default: "" }),
	DB_NAME: str({ default: "" }),
	X_API_KEY: str({ default: "" }),
	JWT_SECRET: str({ default: "" }),
	DB_URL: str({ default: "" }),
	JWT_REFRESH_SECRET: str({ default: "" }),
	NODE_ENV: str({
		choices: ["development", "test", "production", "staging"],
	}),
	PORT: port({ default: 80 }),
});

export default customEnv;
