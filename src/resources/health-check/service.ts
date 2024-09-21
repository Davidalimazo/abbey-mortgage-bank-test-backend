import { Response, Request } from "express";
import { HttpStatus } from "../../lib/constants/http_status";

class HealthCheckService {
	async getRoute(req: Request, res: Response) {
		return res.status(HttpStatus.OK).json("Hello World");
	}
}

export default new HealthCheckService();
