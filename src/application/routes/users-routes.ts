import {Router} from "express"
import { userControllers } from "../controllers/users-controller"
import { adminMiddleware } from "../middlewares/adminMiddleware";
import { upload } from "../middlewares/multer";
import {
  validateAdminUpdateUser,
  validateIdParam,
  validateRespectPilot,
  validateUserAllSearch,
} from "../middlewares/validationMiddleware";


const userRouter: Router =  Router()



const userController = new userControllers();

userRouter.get("/me",userController.getUser)

userRouter.delete("/deleteUser/:id",validateIdParam("id"),userController.deleteUser)
userRouter.patch("/updateMe",upload.single("foto_perfil"),userController.updateMe)
userRouter.get("/discoverPilot",userController.discoverPilot)
userRouter.post("/respectPilot",validateRespectPilot,userController.respectPilot)
userRouter.get("/getRespectPilot",userController.getRespectPilot)

//ADMIN
userRouter.get("/UserAll",adminMiddleware,userController.UserAll)
userRouter.get("/UserAllSearch",adminMiddleware,validateUserAllSearch,userController.UserAllSearch)
userRouter.patch("/updateUser",adminMiddleware,validateAdminUpdateUser,userController.updateUser)






export default userRouter

