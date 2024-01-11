import express from "express";
import personnelController from "./controller"

const personnelRouter = express.Router();

personnelRouter.post("/create", personnelController.createPersonnel)
personnelRouter.get("/id/:id", personnelController.getPersonnelByPersonalNo)
personnelRouter.post("/upload", personnelController.uploadPersonnels)
personnelRouter.get("/all", personnelController.getAllPersonnels)
personnelRouter.get("/geopolitical-zone/count", personnelController.getGeopoliticalZoneCount)
personnelRouter.get("/mgnt-records", personnelController.getAllPersonelMgntData)
personnelRouter.get("/mgnt-records/query", personnelController.getAllPersonelMgntDataByQuery)
personnelRouter.get("/mgnt-records/:personalNo", personnelController.getPersonelMgntData)
personnelRouter.get("/pending-retirement", personnelController.findPendingRetirementCount)
personnelRouter.get("/newly-commissioned", personnelController.findNewCommissionedCount)
personnelRouter.post("/personnel/search", personnelController.getPersonnelsByCriteria)
personnelRouter.get("/rank/count", personnelController.getRankCountData)
personnelRouter.get("/commission/types/count", personnelController.getTypeOfCommissionCountData)
personnelRouter.get("/personnel-status/active/corps", personnelController.getActiveCorpsCountData)
personnelRouter.get("/card/count", personnelController.findPersonnelActiveNonActivePostingAndRetirementCount)

export default personnelRouter;