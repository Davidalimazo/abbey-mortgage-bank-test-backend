import express from "express";
import settingsController from "./controller"


const authRouter = express.Router();

authRouter.get("/backup-now", settingsController.performRmanBackup)


export default authRouter;