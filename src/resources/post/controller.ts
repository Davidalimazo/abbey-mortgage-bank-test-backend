import { Request, Response } from "express";
import postService from "./service";

class PostController {
	async createpost(req: Request, res: Response) {
		return await postService.createpost(req, res);
	}
	async editPost(req: Request, res: Response) {
		return await postService.editPost(req, res);
	}
	async getAllPost(req: Request, res: Response) {
		return await postService.getAllPost(req, res);
	}
}

export default new PostController();
