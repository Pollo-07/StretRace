"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const users_routes_1 = __importDefault(require("./users-routes"));
const vehicle_routes_1 = __importDefault(require("./vehicle-routes"));
const challenge_routes_1 = __importDefault(require("./challenge-routes"));
const category_routes_1 = __importDefault(require("./category-routes"));
const notification_routes_1 = __importDefault(require("./notification-routes"));
const authMiddleware_1 = require("../middlewares/authMiddleware");
const auth_router_1 = __importDefault(require("./auth-router"));
const users_controller_1 = require("../controllers/users-controller");
const validationMiddleware_1 = require("../middlewares/validationMiddleware");
const AppRouter = (0, express_1.Router)();
const userController = new users_controller_1.userControllers();
AppRouter.get("/", (req, res) => {
    res.status(200).send("Bienvenidos al Street race");
});
AppRouter.use("/user", authMiddleware_1.authMiddleware, users_routes_1.default);
AppRouter.post("/register", validationMiddleware_1.validateRegister, userController.RegisterUsers);
AppRouter.use("/vehicles", authMiddleware_1.authMiddleware, vehicle_routes_1.default);
AppRouter.use("/challenges", authMiddleware_1.authMiddleware, challenge_routes_1.default);
AppRouter.use("/category", authMiddleware_1.authMiddleware, category_routes_1.default);
AppRouter.use("/notification", authMiddleware_1.authMiddleware, notification_routes_1.default);
AppRouter.use("/auth", auth_router_1.default);
exports.default = AppRouter;
//# sourceMappingURL=app-router.js.map