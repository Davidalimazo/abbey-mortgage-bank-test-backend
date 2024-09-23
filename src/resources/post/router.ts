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
		this.router.put(
			"/edit/:postId",
			checkTokenAndDecode,
			this.controller.editPost,
		);
		this.router.get(
			"/all",
			checkTokenAndDecode,
			this.controller.getAllPost,
		);
		this.router.get(
			"/user-post/:userId",
			checkTokenAndDecode,
			this.controller.getUserPost,
		);
		this.router.delete(
			"/delete-post/:postId",
			checkTokenAndDecode,
			this.controller.deletePost,
		);
	}
}

export default new PostRouter().router;
