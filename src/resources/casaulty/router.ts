import express from "express";
import casaultyController from "./controller"

const casaultyRouter = express.Router();

casaultyRouter.get("/id/:id", casaultyController.getCasaultyByPersonalNo)
casaultyRouter.post("/upload-records", casaultyController.upload)
casaultyRouter.get("/all", casaultyController.getAllCasaultys)
//casaultyRouter.post("/personnel/search", casaultyController.getcasaultysByCriteria)

export default casaultyRouter;
