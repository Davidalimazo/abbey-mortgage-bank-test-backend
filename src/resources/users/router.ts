import express, { Router } from "express";
import userController from "./controller";
import { IRouter } from "../../types/router_interface";

class UserRouter extends IRouter {
	controller;
	router: Router;

	constructor() {
		super();
		this.controller = userController;
		this.router = Router();
		this.initializeRoutes();
	}

	initializeRoutes() {
		this.router.post("/user/create", userController.createUser);
		this.router.post("/user/login", userController.login);
	}
}

export default new UserRouter().router;
