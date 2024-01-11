import express from "express";
import AwolCountroller from "./controller"

const AwolRouter = express.Router();

AwolRouter.get("/id/:id", AwolCountroller.getAwolByPersonalNo)
AwolRouter.post("/upload-records", AwolCountroller.upload)
AwolRouter.get("/all", AwolCountroller.getAllAwol)
AwolRouter.get("/awol-count", AwolCountroller.findAwolCountInGPZ)
AwolRouter.post("/personnel/search", AwolCountroller.getAwolsByCriteria)

export default AwolRouter;
