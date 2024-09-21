import "dotenv/config";
import App from "./app";
import Launcher from "./lib/server/launcher";
import authRouter from "./resources/users/router";
import customEnv from "./lib/validateEnv";
import healthCheckRouter from "./resources/health-check/router";
import postRouter from "./resources/post/router";

const app = new App([
	{ path: "auth", router: authRouter },
	{ path: "health-check", router: healthCheckRouter },
	{ path: "post", router: postRouter },
]);
const server = new Launcher(app.express, customEnv.PORT);
server.initServer();
