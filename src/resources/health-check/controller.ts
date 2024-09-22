import { Request, Response } from "express";
import healthCheckService from "./service";

class HealthCheckController {
	async getRoute(req: Request, res: Response) {
		return healthCheckService.getRoute(req, res);
	}
}

export default new HealthCheckController();
