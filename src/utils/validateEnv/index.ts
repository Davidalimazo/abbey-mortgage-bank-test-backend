import {cleanEnv, str, port, url} from "envalid";


const env = cleanEnv(process.env, {
  SERVER_BASE_URL: str({ default: '' }),
  DB_USERNAME: str({ default: '' }),
  DB_PASSWORD: str({ default: '' }),
  DB_NAME:str({ default: '' }),
  X_API_KEY: str({ default: '' }),
  DB_URI: str({ default: '' }),
  JWT_SECRET: str({ default: '' }),
  CLIENT_BASE_URL: str({ default: '' }),
  NODE_ENV:str({
	choices:["development", "production", "test"], 
}),
PORT:port({default:3001}),
DB_PORT:port({default:1521})
  
});
export default env;