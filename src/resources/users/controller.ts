import { Request, Response } from "express";
import userService from "./service";

class UserController {
	async createUser(req: Request, res: Response) {
		return await userService.createUser(req, res);
	}

	async login(req: Request, res: Response) {
		return await userService.login(req, res);
	}
	async refreshToken(req: Request, res: Response) {
		return await userService.login(req, res);
	}
	async changePassword(req: Request, res: Response) {
		return await userService.changeUserPassword(req, res);
	}
}

export default new UserController();
