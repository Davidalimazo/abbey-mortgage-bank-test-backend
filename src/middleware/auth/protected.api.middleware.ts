import { Request, Response, NextFunction } from "express";
import jwt, { JwtPayload, VerifyErrors } from "jsonwebtoken";
import customEnv from "../../lib/validateEnv";

// interface Locals extends Record<string, any> {
//     USER_ID: string;
//   }
//   export interface MyRequest extends Request {
//     locals: Locals;
//   }

const WHITE_LISTED_URL = ["/api/auth/user/login"];

// Middleware function
export const checkTokenAndDecode: (
	req: Request,
	res: Response,
	next: NextFunction,
) => void = async (req, res, next) => {
	console.log(req.url);
	try {
		if (
			req.url === "/api/v1/auth/user/login" ||
			req.url === "/api/v1/auth/user/create" ||
			req.url === "/api/v1/health-check/get"
		) {
			return next();
		}

		// Check if the token is present in the request headers or query parameters or wherever it might be
		const token = req.headers["authorization"];

		if (!token || token.split(" ")[0] === "Bearer ") {
			return res.status(401).json({ message: "No token provided" });
		}

		const bearerToken = token.split(" ")[1];

		await jwt.verify(
			bearerToken,
			customEnv.JWT_SECRET,
			(err: any, decoded: any | undefined) => {
				if (err) {
					console.error("Token verification error:", err.message);
					return res
						.status(401)
						.json({ error: "Unauthorized: Invalid token" });
				}

				if (!decoded) {
					console.error("Invalid token structure");
					return res.status(401).json({
						error: "Unauthorized: Invalid token structure",
					});
				}

				// Add the decoded 'USER_ID' to req.locals for use in subsequent middleware/routes
				//@ts-ignore
				req.locals = { ...decoded };

				next();
			},
		);
	} catch (error: any) {
		return res.status(500).json({ message: error.message });
	}
};
