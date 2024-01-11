import express from "express";
import spouseCountroller from "./controller"

const spouseRouter = express.Router();

spouseRouter.get("/id/:id", spouseCountroller.getSpouseByPersonalNo)
spouseRouter.post("/upload-records", spouseCountroller.upload)
spouseRouter.get("/all", spouseCountroller.getAllSpouses)
spouseRouter.post("/personnel/search", spouseCountroller.getSpousesByCriteria)

export default spouseRouter;
