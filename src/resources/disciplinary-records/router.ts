import express from "express";
import disciplinaryRecordsCountroller from "./controller"

const disciplinaryRecordsRouter = express.Router();

disciplinaryRecordsRouter.get("/id/:id", disciplinaryRecordsCountroller.getDisciplinaryRecordsByPersonalNo)
disciplinaryRecordsRouter.post("/upload-records", disciplinaryRecordsCountroller.upload)
disciplinaryRecordsRouter.get("/all", disciplinaryRecordsCountroller.getAllDisciplinaryRecords)
disciplinaryRecordsRouter.post("/personnel/search", disciplinaryRecordsCountroller.getDisciplinaryRecordssByCriteria)

export default disciplinaryRecordsRouter;
