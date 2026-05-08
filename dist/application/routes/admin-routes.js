"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.adminRoutes = void 0;
const express_1 = require("express");
const admin_contollers_1 = __importDefault(require("../controllers/admin-contollers"));
const adminController = new admin_contollers_1.default();
exports.adminRoutes = (0, express_1.Router)();
exports.adminRoutes.post("/loginAdmin", adminController.loginAdmin);
exports.adminRoutes.get("/allUser", adminController.UserAll);
exports.adminRoutes.patch("/updateUser", adminController.updateUser);
exports.adminRoutes.delete("/deleteUser", adminController.deleteUser);
exports.adminRoutes.get("/allChallenge", adminController.challengeAll);
exports.adminRoutes.patch("/updatechallenge", adminController.updatechallenge);
exports.adminRoutes.delete("/deletechallenge", adminController.deletechallenge);
exports.adminRoutes.post("/refreshTokens", adminController.refreshTokens);
exports.adminRoutes.post("/logout", adminController.logout);
//# sourceMappingURL=admin-routes.js.map