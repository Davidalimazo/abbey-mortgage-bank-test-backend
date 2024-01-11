import express from "express";
import honoursController from "./controller"

const honoursRouter = express.Router();

honoursRouter.get("/id/:id", honoursController.getHonoursByPersonalNo)
honoursRouter.post("/upload-records", honoursController.upload)
honoursRouter.get("/all", honoursController.getAllHonourss)
//honoursRouter.post("/personnel/search", honoursController.gethonourssByCriteria)

export default honoursRouter;
