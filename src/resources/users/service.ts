import { Request, Response } from "express";
import userRepository from "./repository";
import { HttpStatus } from "../../lib/constants/http_status";
import { sign } from "jsonwebtoken";
import customEnv from "../../lib/validateEnv";

class UserService {
	async createUser(req: Request, res: Response): Promise<any> {
		const { username, email, password, profilePicture } = req.body;
		try {
			const data = await userRepository.createUser({
				username,
				email,
				password,
				profilePicture,
			});

			if (data.status === HttpStatus.OK) {
				res.locals.user = data.data;
				const token = sign({ ...data.data }, customEnv.JWT_SECRET, {
					expiresIn: "30m",
				});
				return res.status(HttpStatus.OK).json(token);
			} else {
				return res.status(data.status).json({ error: data.message });
			}
		} catch (error: any) {
			return res
				.status(HttpStatus.INTERNAL_SERVER_ERROR)
				.json(error.message);
		}
	}
	async login(req: Request, res: Response): Promise<any> {
		const { email, password } = req.body;
		try {
			const data = await userRepository.login({
				email,
				password,
			});

			if (data.status === HttpStatus.OK) {
				res.locals.user = data.data;
				const token = sign({ ...data.data }, customEnv.JWT_SECRET, {
					expiresIn: "30m",
					algorithm: "HS256",
				});
				return res.status(HttpStatus.OK).json(token);
			} else {
				return res.status(data.status).json({ error: data.message });
			}
		} catch (error: any) {
			return res
				.status(HttpStatus.INTERNAL_SERVER_ERROR)
				.json(error.message);
		}
	}
}

export default new UserService();
