import {Router} from "express"
import { vehicleControllers } from "../controllers/vehicle-conotroller"
import { upload } from "../middlewares/multer"
import {
  validateCreateVehicle,
  validateIdParam,
  validateUpdateVehicle,
} from "../middlewares/validationMiddleware";

const RoutesVehicle:Router = Router()

const vehicleController = new vehicleControllers()

RoutesVehicle.post("/createVehicle",upload.single("foto"),validateCreateVehicle,vehicleController.createVehicle)
RoutesVehicle.get("/vehicle",vehicleController.getVehicle)
RoutesVehicle.get("/allVehicles",vehicleController.allVehicle)
RoutesVehicle.delete("/deleteVehicle/:id",validateIdParam("id"),vehicleController.deleteVehicle)
RoutesVehicle.patch("/updateVehicle",validateUpdateVehicle,vehicleController.updateVehicle)
RoutesVehicle.patch("/activeVehicle/:id",validateIdParam("id"),vehicleController.activeVehicle)



 export default RoutesVehicle
