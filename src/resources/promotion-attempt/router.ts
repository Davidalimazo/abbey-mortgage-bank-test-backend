import express from "express";
import promotionAttemptController from "./controller"

const promotionAttemptRouter = express.Router();

promotionAttemptRouter.get("/id/:id", promotionAttemptController.getPromotionAttemptByPersonalNo)
promotionAttemptRouter.post("/upload-records", promotionAttemptController.upload)
promotionAttemptRouter.get("/all", promotionAttemptController.getAllPromotionAttempts)
// promotionAttemptRouter.post("/personnel/search", promotionAttemptController.getpromotionAttemptsByCriteria)

export default promotionAttemptRouter;
