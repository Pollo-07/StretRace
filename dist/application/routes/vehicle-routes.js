"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const vehicle_conotroller_1 = require("../controllers/vehicle-conotroller");
const multer_1 = require("../middlewares/multer");
const validationMiddleware_1 = require("../middlewares/validationMiddleware");
const RoutesVehicle = (0, express_1.Router)();
const vehicleController = new vehicle_conotroller_1.vehicleControllers();
RoutesVehicle.post("/createVehicle", multer_1.upload.single("foto"), validationMiddleware_1.validateCreateVehicle, vehicleController.createVehicle);
RoutesVehicle.get("/vehicle", vehicleController.getVehicle);
RoutesVehicle.get("/allVehicles", vehicleController.allVehicle);
RoutesVehicle.delete("/deleteVehicle/:id", (0, validationMiddleware_1.validateIdParam)("id"), vehicleController.deleteVehicle);
RoutesVehicle.patch("/updateVehicle", validationMiddleware_1.validateUpdateVehicle, vehicleController.updateVehicle);
RoutesVehicle.patch("/activeVehicle/:id", (0, validationMiddleware_1.validateIdParam)("id"), vehicleController.activeVehicle);
exports.default = RoutesVehicle;
//# sourceMappingURL=vehicle-routes.js.map