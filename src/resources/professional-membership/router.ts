import express from "express";
import promembershipCountroller from "./controller"

const promembershipRouter = express.Router();

promembershipRouter.get("/id/:id", promembershipCountroller.getPromembershipByPersonalNo)
promembershipRouter.post("/upload-records", promembershipCountroller.upload)
promembershipRouter.get("/all", promembershipCountroller.getAllPromembership)
promembershipRouter.post("/personnel/search", promembershipCountroller.getPromembershipsByCriteria)

export default promembershipRouter;
