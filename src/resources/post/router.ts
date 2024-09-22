import express, { Router } from "express";
import PostController from "./controller";
import { IRouter } from "../../types/router_interface";
import { checkTokenAndDecode } from "../../middleware/auth/protected.api.middleware";

class PostRouter extends IRouter {
	controller;
	router: Router;

	constructor() {
		super();
		this.controller = PostController;
		this.router = Router();
		this.initializeRoutes();
	}

	initializeRoutes() {
		this.router.post(
			"/create",
			checkTokenAndDecode,
			this.controller.createpost,
		);
		this.router.put("/edit", checkTokenAndDecode, this.controller.editPost);
		this.router.get(
			"/all",
			checkTokenAndDecode,
			this.controller.getAllPost,
		);
	}
}

export default new PostRouter().router;
