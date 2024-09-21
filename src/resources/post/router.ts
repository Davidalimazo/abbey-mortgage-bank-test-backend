import express, { Router } from "express";
import PostController from "./controller";
import { IRouter } from "../../types/router_interface";

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
		this.router.post("/create", this.controller.createpost);
		this.router.put("/edit", this.controller.editPost);
		this.router.get("/all", this.controller.getAllPost);
	}
}

export default new PostRouter().router;
