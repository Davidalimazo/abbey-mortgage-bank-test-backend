import express from "express";
import militaryCountroller from "./controller"

const militaryRouter = express.Router();

militaryRouter.get("/id/:id", militaryCountroller.getMilitaryByPersonalNo)
militaryRouter.post("/upload-records", militaryCountroller.upload)
militaryRouter.get("/all", militaryCountroller.getAllMilitaryInfo)
militaryRouter.post("/search", militaryCountroller.getMilitarysByCriteria)
militaryRouter.put("/update/:id", militaryCountroller.updateMilitaryInfoByPersonalNo)
militaryRouter.get("/column/:column", militaryCountroller.getByColumnNameInfo)

export default militaryRouter;
