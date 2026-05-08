"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const users_controller_1 = require("../controllers/users-controller");
const adminMiddleware_1 = require("../middlewares/adminMiddleware");
const multer_1 = require("../middlewares/multer");
const validationMiddleware_1 = require("../middlewares/validationMiddleware");
const userRouter = (0, express_1.Router)();
const userController = new users_controller_1.userControllers();
userRouter.get("/me", userController.getUser);
userRouter.delete("/deleteUser/:id", (0, validationMiddleware_1.validateIdParam)("id"), userController.deleteUser);
userRouter.patch("/updateMe", multer_1.upload.single("foto_perfil"), userController.updateMe);
userRouter.get("/discoverPilot", userController.discoverPilot);
userRouter.post("/respectPilot", validationMiddleware_1.validateRespectPilot, userController.respectPilot);
userRouter.get("/getRespectPilot", userController.getRespectPilot);
//ADMIN
userRouter.get("/UserAll", adminMiddleware_1.adminMiddleware, userController.UserAll);
userRouter.get("/UserAllSearch", adminMiddleware_1.adminMiddleware, validationMiddleware_1.validateUserAllSearch, userController.UserAllSearch);
userRouter.patch("/updateUser", adminMiddleware_1.adminMiddleware, validationMiddleware_1.validateAdminUpdateUser, userController.updateUser);
exports.default = userRouter;
//# sourceMappingURL=users-routes.js.map