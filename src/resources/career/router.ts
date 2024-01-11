import express from "express";
import careerController from "./controller"

const careerRouter = express.Router();

careerRouter.get("/id/:id", careerController.getCareerByPersonalNo)
careerRouter.post("/upload-records", careerController.upload)
careerRouter.get("/all", careerController.getAllCareers)
careerRouter.post("/personnel/search", careerController.getCareersByCriteria)

export default careerRouter;
