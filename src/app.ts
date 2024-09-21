import express, { Application } from "express";
import compression from "compression";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import IController from "./lib/interfaces/controller.interface";
import ErrorMiddleWare from "./middleware/error/error.middleware";
import apiKeyMiddleware from "./middleware/auth/api.key.middleware";

import { checkTokenAndDecode } from "./middleware/auth/protected.api.middleware";
import path from "path";
import mongoose from "mongoose";
import customEnv from "./lib/validateEnv";

class App {
	public express: Application;
	public publicPath = path.join(__dirname, "..", "..", "public");

	constructor(controller: IController[]) {
		this.express = express();

		this.initializeDatabase();
		this.initializeMiddleWare();
		this.initializeControllers(controller);
		this.initializeErrorhandling();
	}
	private initializeMiddleWare() {
		this.express.use(cors());
		this.express.use(helmet());
		this.express.use(morgan("combined"));
		this.express.use(compression());
		this.express.use(checkTokenAndDecode);
		// Increase payload size limit
		this.express.use(express.json({ limit: "50mb" }));
		this.express.use(express.static(this.publicPath));
		this.express.use(express.urlencoded({ limit: "50mb", extended: true }));
		this.express.use(apiKeyMiddleware);
	}
	private initializeControllers(controllers: IController[]) {
		controllers.forEach((controller) => {
			this.express.use(`/api/v1/${controller.path}`, controller.router);
		});
	}

	private initializeDatabase() {
		mongoose
			.connect(customEnv.DB_URL, { retryWrites: true })
			.then((state) => console.log("Connected to db"))
			.catch((err) => console.log("Error connecting to db: ", err));
	}

	private initializeErrorhandling(): void {
		this.express.use(ErrorMiddleWare);
	}
}

export default App;
