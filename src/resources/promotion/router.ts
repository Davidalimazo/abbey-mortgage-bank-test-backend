import express from "express";
import promotionController from "./controller"

const promotionHouter = express.Router();

promotionHouter.get("/id/:id", promotionController.getPromotionHistoryByPersonalNo)
promotionHouter.post("/upload-records", promotionController.upload)
promotionHouter.get("/all", promotionController.getAllPromotionHistory)
promotionHouter.get("/first-promotion/:id", promotionController.findFirstPromotionDetails)
promotionHouter.post("/personnel/search", promotionController.getPromotionHistorysByCriteria)

export default promotionHouter;
