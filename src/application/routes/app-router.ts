import {Router,Request,Response} from "express"
import userRouter from "./users-routes"
import RoutesVehicle from "./vehicle-routes"
import challengeRoutes from "./challenge-routes"
import categoryRouter from "./category-routes"
import notificationRouter from "./notification-routes"
import { authMiddleware } from "../middlewares/authMiddleware";
import authRouter from "./auth-router"
import { userControllers } from "../controllers/users-controller"
import { validateRegister } from "../middlewares/validationMiddleware";


const AppRouter:Router = Router()
const userController = new userControllers();

AppRouter.get("/",(req:Request,res:Response)=>{
    res.status(200).send("Bienvenidos al Street race")
})


AppRouter.use("/user",authMiddleware,userRouter)
AppRouter.post("/register",validateRegister,userController.RegisterUsers)

AppRouter.use("/vehicles",authMiddleware,RoutesVehicle)
AppRouter.use("/challenges",authMiddleware,challengeRoutes)
AppRouter.use("/category",authMiddleware,categoryRouter)
AppRouter.use("/notification",authMiddleware,notificationRouter)
AppRouter.use("/auth",authRouter)

export default AppRouter
