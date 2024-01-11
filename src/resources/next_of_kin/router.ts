import express from "express";
import nextOfKinCountroller from "./controller"

const nextOfKinRouter = express.Router();

nextOfKinRouter.get("/id/:id", nextOfKinCountroller.getNextOfKinByPersonalNo)
nextOfKinRouter.post("/upload-records", nextOfKinCountroller.upload)
nextOfKinRouter.get("/all", nextOfKinCountroller.getAllNextOfKins)
nextOfKinRouter.post("/personnel/search", nextOfKinCountroller.getNextOfKinsByCriteria)

export default nextOfKinRouter;
