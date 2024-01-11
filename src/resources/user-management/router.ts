import express from "express";
import userManagementController from "./controller"

const userManagementRouter = express.Router();

userManagementRouter.get("/tables", userManagementController.getAllTableName);
userManagementRouter.get("/tables/:columnName", userManagementController.findTableColumns);
userManagementRouter.post("/query", userManagementController.queryFinder);
userManagementRouter.post("/query/runner", userManagementController.queryRunner);
userManagementRouter.post("/search", userManagementController.findPersonnelByNo);
userManagementRouter.get("/search/name/:name", userManagementController.findPersonnelByName);
userManagementRouter.get("/search/phone/:phoneNumber", userManagementController.findPersonnelByPhoneNumber);
userManagementRouter.get("/search/age/:age", userManagementController.findPersonnelAge);
userManagementRouter.post("/search/age/page", userManagementController.findPersonnelAgePaginated);
userManagementRouter.post("/search/single", userManagementController.findIndividualSearchData);

export default userManagementRouter;
