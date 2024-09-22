import { Router } from "express";
import HealthCheckController from "./controller";
import { IRouter } from "../../types/router_interface";

class HealthCheckRouter extends IRouter {
	controller;
	router: Router;

	constructor() {
		super();
		this.controller = HealthCheckController;
		this.router = Router();
		this.initializeRoutes();
	}

	initializeRoutes() {
		this.router.get("/", this.controller.getRoute);
	}
}

export default new HealthCheckRouter().router;
