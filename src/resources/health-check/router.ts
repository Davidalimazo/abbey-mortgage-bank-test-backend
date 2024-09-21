import { Router } from "express";
import healthCheckController from "./controller";

const healthCheckRouter = Router();

healthCheckRouter.get("/get", healthCheckController.getRoute);
export default healthCheckRouter;
