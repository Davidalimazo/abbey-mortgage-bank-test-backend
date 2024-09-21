import { Request, Response } from "express";
import healthCheckService from "./service";

class HealthCheckController {
    async getRoute(req: Request, res: Response) {
        console.log(req.body);
        return healthCheckService.getRoute(req, res);
    }
}

export default new HealthCheckController();
