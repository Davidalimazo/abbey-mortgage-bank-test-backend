import express from "express";
import militaryQualificationCountroller from "./controller"

const militaryQualificationRouter = express.Router();

militaryQualificationRouter.get("/id/:id", militaryQualificationCountroller.getmilitaryQualificationsByPersonalNo)
militaryQualificationRouter.post("/upload-records", militaryQualificationCountroller.upload)
militaryQualificationRouter.get("/all", militaryQualificationCountroller.getAllmilitaryQualifications)
militaryQualificationRouter.post("/personnel/search", militaryQualificationCountroller.getmilitaryQualificationssByCriteria)

export default militaryQualificationRouter;
