import UserDAO from "./dao";
import userRepository from "./repository";
import { Request, Response } from "express";
import { sign, verify } from "jsonwebtoken";
import customEnv from "../../lib/validateEnv";
import { HttpStatus } from "../../lib/constants/http_status";
import { signRefreshToken } from "../../lib/helpers/token_utils";
import { IUser } from "./interfaces";

class UserService {
	async createUser(req: Request, res: Response): Promise<any> {
		try {
			const data = await userRepository.createUser({
				...req.body,
			});

			if (data.status === HttpStatus.OK) {
				res.locals.user = data.data;
				const token = sign({ ...data.data }, customEnv.JWT_SECRET, {
					expiresIn: "30m",
				});
				if (data.data !== null) {
					const refreshToken = await signRefreshToken(
						data.data.userId,
						data.data,
					);

					return res
						.status(HttpStatus.OK)
						.json({ token, refreshToken });
				}
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

	async changeUserPassword(req: Request, res: Response) {
		const { oldPassword, newPassword } = req.body;

		try {
			const data = await userRepository.changeUserPassword({
				oldPassword,
				newPassword,
				email: res.locals.user?.email ?? "",
			});

			if (data.status === HttpStatus.OK) {
				
				return res.status(HttpStatus.OK).json(true);
			} else {
				return res.status(data.status).json({ error: data.message });
			}
		} catch (error: any) {
			return res
				.status(HttpStatus.INTERNAL_SERVER_ERROR)
				.json(error.message);
		}
	}

	async refreshToken(req: Request, res: Response) {
		try {
			const { refreshToken } = req.body;

			return await verify(
				refreshToken,
				customEnv.JWT_REFRESH_SECRET,
				async (err: any, decoded: any | undefined) => {
					if (err) {
						return res
							.status(HttpStatus.BAD_REQUEST)
							.json({ error: err.message });
					}

					if (!decoded) {
						return res
							.status(HttpStatus.BAD_REQUEST)
							.json({ error: "Invalid Token Structure" });
					}
					let user: IUser = await UserDAO.findUserByEmail(
						decoded?.email,
					);
					const { password, ...rest } = user;
					res.locals.user = { ...rest };
					const token = sign(
						{ ...rest },
						customEnv.JWT_REFRESH_SECRET,
						{
							expiresIn: "3h",
						},
					);
					return res
						.status(HttpStatus.OK)
						.json({ token, refreshToken });
				},
			);
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
				if (data.data !== null) {
					const refreshToken = await signRefreshToken(
						data.data.userId,
						data.data,
					);

					return res
						.status(HttpStatus.OK)
						.json({ token, refreshToken });
				}
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
