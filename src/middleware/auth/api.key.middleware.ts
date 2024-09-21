// apikeyMiddleware.ts

import { Request, Response, NextFunction } from "express";
import env from "../../lib/validateEnv";

const apiKeyMiddleware = (req: Request, res: Response, next: NextFunction) => {
	// Get the API key from the request header
	const apiKey = req.headers["x-api-key"];

	// Check if API key is present
	if (!apiKey) {
		return res.status(401).json({ error: "API key is missing" });
	}

	// Check the validity of the API key (you can implement your own logic here)
	if (apiKey !== env.X_API_KEY) {
		return res.status(403).json({ error: "Invalid API key" });
	}

	// API key is valid, proceed to the next middleware or route handler
	next();
};

export default apiKeyMiddleware;
