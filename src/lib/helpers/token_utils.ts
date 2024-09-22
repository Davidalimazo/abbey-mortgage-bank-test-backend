import { Response } from "express";
//import { customEnv } from ".";
import jwt from "jsonwebtoken";
import { USER_ENUM } from "../enums/auth.enum";
import { IUser, IUserResponse } from "../../resources/users/interfaces";
import customEnv from "../validateEnv";

export const signRefreshToken = async (userId: string, user: IUserResponse) => {
	try {
		const token = await jwt.sign(
			{ ...user },
			customEnv.JWT_REFRESH_SECRET,
			{
				expiresIn: "30d",
				issuer: "ahqms",
				audience: userId,
			},
		);
		return token;
	} catch (error: any) {
		throw new Error(error.message);
	}
};

export const verifyRefreshTokenValidator = async (
	refreshToken: string,
	res: Response,
) => {
	try {
		return await jwt.verify(
			refreshToken,
			customEnv.JWT_REFRESH_SECRET,
			(err: any, decoded: any | undefined) => {
				if (err) {
					throw new Error(err.message);
				}

				if (!decoded) {
					throw new Error("Unauthorized: Invalid token structure");
				}
				res.locals.user = { ...decoded };
				return decoded;
			},
		);
	} catch (error: any) {
		throw new Error(error.message);
	}
};
