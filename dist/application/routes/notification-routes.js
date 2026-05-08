"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const notification_controller_1 = __importDefault(require("../controllers/notification-controller"));
const validationMiddleware_1 = require("../middlewares/validationMiddleware");
const NotificationController = new notification_controller_1.default();
const notificationRouter = (0, express_1.Router)();
notificationRouter.get("/", NotificationController.getNotification);
notificationRouter.delete("/deleteNotification", validationMiddleware_1.validateIdBody, NotificationController.deleteNotification);
notificationRouter.patch("/allNotificationsAsRead", NotificationController.AllNotificationsAsRead);
exports.default = notificationRouter;
//# sourceMappingURL=notification-routes.js.map