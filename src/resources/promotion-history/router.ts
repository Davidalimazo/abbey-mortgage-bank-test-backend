import express from "express";
import promotionHistoryCountroller from "./controller"

const promotionHistoryRouter = express.Router();

promotionHistoryRouter.get("/id/:id", promotionHistoryCountroller.getPromotionHistoryByPersonalNo)
promotionHistoryRouter.post("/upload-records", promotionHistoryCountroller.upload)
promotionHistoryRouter.get("/all", promotionHistoryCountroller.getAllPromotionHistory)
promotionHistoryRouter.get("/first-promotion/:id", promotionHistoryCountroller.findFirstPromotionDetails)
promotionHistoryRouter.post("/personnel/search", promotionHistoryCountroller.getPromotionHistorysByCriteria)

export default promotionHistoryRouter;
