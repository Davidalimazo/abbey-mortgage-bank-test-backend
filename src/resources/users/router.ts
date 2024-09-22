import express, { Router } from "express";
import userController from "./controller";
import { IRouter } from "../../types/router_interface";
import { checkTokenAndDecode } from "../../middleware/auth/protected.api.middleware";

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
		this.router.post(
			"/user/change-password",
			checkTokenAndDecode,
			userController.changePassword,
		);
		this.router.post("/user/refresh-token", userController.refreshToken);
	}
}

export default new UserRouter().router;
