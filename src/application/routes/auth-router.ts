import { Router } from "express";
import authController from "../controllers/auth-controller";
import { userControllers } from "../controllers/users-controller";
import { validateLogin, validateRegister } from "../middlewares/validationMiddleware";


const authControllers = new authController()
const userController = new userControllers()

const authRouter:Router = Router()

authRouter.post("/login",validateLogin,authControllers.login)
authRouter.post("/logout",authControllers.logout)
authRouter.post("/register",validateRegister,userController.RegisterUsers)

authRouter.post("/refreshTokens",authControllers.refreshTokens)

export  default authRouter
