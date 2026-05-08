
import {Router} from "express"
import notificationController from "../controllers/notification-controller"
import { validateIdBody } from "../middlewares/validationMiddleware";


const NotificationController = new notificationController()

const notificationRouter: Router =  Router()


notificationRouter.get("/",NotificationController.getNotification)
notificationRouter.delete("/deleteNotification",validateIdBody,NotificationController.deleteNotification)
notificationRouter.patch("/allNotificationsAsRead",NotificationController.AllNotificationsAsRead)



export default notificationRouter
