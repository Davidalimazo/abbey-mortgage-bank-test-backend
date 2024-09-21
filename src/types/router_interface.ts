import { Router } from "express";

export abstract class IRouter {
	abstract initializeRoutes(): void;
}
