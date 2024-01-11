import express from "express";
import consultancyController from "./controller"

const consultancyRouter = express.Router();

consultancyRouter.get("/id/:id", consultancyController.getConsultancyByPersonalNo)
consultancyRouter.post("/upload-records", consultancyController.upload)
consultancyRouter.get("/all", consultancyController.getAllConsultancy)
//consultancyRouter.post("/personnel/search", consultancyController.getconsultancysByCriteria)

export default consultancyRouter;
