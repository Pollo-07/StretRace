"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const category_controller_1 = __importDefault(require("../controllers/category-controller"));
const validationMiddleware_1 = require("../middlewares/validationMiddleware");
const categoryRouter = (0, express_1.Router)();
const categoryControllers = new category_controller_1.default();
categoryRouter.get("/category", validationMiddleware_1.validateIdBody, categoryControllers.getcategory);
categoryRouter.post("/createCategory", validationMiddleware_1.validateCreateCategory, categoryControllers.createcategory);
categoryRouter.delete("/deleteCategory", validationMiddleware_1.validateIdBody, categoryControllers.deletecategory);
categoryRouter.patch("/updateCategory", validationMiddleware_1.validateUpdateCategory, categoryControllers.updatecategory);
exports.default = categoryRouter;
//# sourceMappingURL=category-routes.js.map