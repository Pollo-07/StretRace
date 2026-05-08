"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_controller_1 = __importDefault(require("../controllers/auth-controller"));
const users_controller_1 = require("../controllers/users-controller");
const validationMiddleware_1 = require("../middlewares/validationMiddleware");
const authControllers = new auth_controller_1.default();
const userController = new users_controller_1.userControllers();
const authRouter = (0, express_1.Router)();
authRouter.post("/login", validationMiddleware_1.validateLogin, authControllers.login);
authRouter.post("/logout", authControllers.logout);
authRouter.post("/register", validationMiddleware_1.validateRegister, userController.RegisterUsers);
authRouter.post("/refreshTokens", authControllers.refreshTokens);
exports.default = authRouter;
//# sourceMappingURL=auth-router.js.map