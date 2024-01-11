import express from "express";
import childrenCountroller from "./controller"

const childrenRouter = express.Router();

childrenRouter.get("/id/:id", childrenCountroller.getChildrenByPersonalNo)
childrenRouter.post("/upload-records", childrenCountroller.upload)
childrenRouter.get("/all", childrenCountroller.getAllChildren)
childrenRouter.post("/personnel/search", childrenCountroller.getChildrensByCriteria)

export default childrenRouter;
