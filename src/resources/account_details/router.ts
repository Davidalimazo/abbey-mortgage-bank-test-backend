import express from "express";
import accountCountroller from "./controller"

const accountRouter = express.Router();

accountRouter.get("/id/:id", accountCountroller.getAccountByPersonalNo)
accountRouter.post("/upload-records", accountCountroller.upload)
accountRouter.get("/all", accountCountroller.getAllAccounts)
accountRouter.post("/personnel/search", accountCountroller.getAccountsByCriteria)

export default accountRouter;
