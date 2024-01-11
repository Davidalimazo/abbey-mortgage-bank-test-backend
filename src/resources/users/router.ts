import express from "express";
import userController from "./controller"


const authRouter = express.Router();

authRouter.post("/user/create", userController.createUser)
authRouter.post("/user/login", userController.login)
authRouter.put("/user/change-email", userController.changeEmail)
authRouter.post("/user/change-status", userController.changeUserStatus)
authRouter.post("/user/delete", userController.deleteUser)
authRouter.put("/user/change-password", userController.changeUserPassword)
authRouter.get("/user/id/:id", userController.getUserById)
authRouter.post("/user/upload", userController.uploadUsersController)
authRouter.get("/user/all", userController.getAllUsers)
authRouter.get("/user/create/role", userController.createUserRole)
authRouter.get("/user/email/:email", userController.getUserByEmail)
authRouter.post("/user/search", userController.getUsersByCriteria)

export default authRouter;