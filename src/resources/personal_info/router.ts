import express from "express";
import personalInfoController from "./controller"

const personalRouter = express.Router();

personalRouter.get("/id/:id", personalInfoController.getPersonnelByPersonalNo)
personalRouter.get("/record/:id", personalInfoController.getPersonnelSpecificPersonalInfo)
personalRouter.get("/record/cv/:id", personalInfoController.getPersonnelCVData)
personalRouter.post("/upload", personalInfoController.uploadPersonnels)
personalRouter.post("/upload-records", personalInfoController.uploadManyPersonnels)
personalRouter.get("/all", personalInfoController.getAllPersonnels)
personalRouter.get("/active-nonactive", personalInfoController.getActiveAndNonActivePersonnelCount)
personalRouter.get("/mgnt-records", personalInfoController.getAllPersonelMgntData)
personalRouter.post("/personnel/search", personalInfoController.getPersonnelsByCriteria)

export default personalRouter;
