import express from "express";
import careerReviewController from "./controller"

const careerReviewRouter = express.Router();

careerReviewRouter.get("/id/:id", careerReviewController.getCareerReviewByPersonalNo)
careerReviewRouter.post("/upload-records", careerReviewController.upload)
careerReviewRouter.get("/all", careerReviewController.getAllCareerReviews)
careerReviewRouter.post("/personnel/search", careerReviewController.getCareerReviewsByCriteria)

export default careerReviewRouter;
