import express from "express";
import languageController from "./controller"

const languageRouter = express.Router();

languageRouter.get("/id/:id", languageController.getLanguageByPersonalNo)
languageRouter.post("/upload-records", languageController.upload)
languageRouter.get("/all", languageController.getAllLanguages)
//languageRouter.post("/personnel/search", languageController.getlanguagesByCriteria)

export default languageRouter;
