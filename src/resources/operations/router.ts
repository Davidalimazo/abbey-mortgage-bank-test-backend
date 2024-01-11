import express from "express";
import operationController from "./controller"

const operationRouter = express.Router();

operationRouter.get("/id/:id", operationController.getOperationsByPersonalNo)
operationRouter.post("/upload-records", operationController.upload)
operationRouter.get("/all", operationController.getAllOperationss)
// operationRouter.post("/personnel/search", operationController.getoperationsByCriteria)

export default operationRouter;
