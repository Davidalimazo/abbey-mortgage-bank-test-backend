import express from "express";
import terminationCountroller from "./controller"

const terminationRouter = express.Router();

terminationRouter.get("/id/:id", terminationCountroller.getTerminationByPersonalNo)
terminationRouter.post("/upload-records", terminationCountroller.upload)
terminationRouter.get("/all", terminationCountroller.getAllTermination)
terminationRouter.post("/personnel/search", terminationCountroller.getTerminationsByCriteria)

export default terminationRouter;
