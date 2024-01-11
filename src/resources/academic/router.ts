import express from "express";
import academicCountroller from "./controller"

const academicRouter = express.Router();

academicRouter.get("/id/:id", academicCountroller.getAcademicByPersonalNo)
academicRouter.post("/upload-records", academicCountroller.upload)
academicRouter.get("/all", academicCountroller.getAllAcademic)
academicRouter.post("/personnel/search", academicCountroller.getAcademicsByCriteria)

export default academicRouter;
