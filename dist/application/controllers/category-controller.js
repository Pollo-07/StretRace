"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const categoryServices_1 = __importDefault(require("../../domain/category/services/categoryServices"));
const categoryRepositorySql_1 = __importDefault(require("../../infrastructure/adapters/categoryRepositorySql"));
const repositoryCategory = new categoryRepositorySql_1.default();
const categoryService = new categoryServices_1.default(repositoryCategory);
class categoryController {
    constructor() {
        this.createcategory = async (req, res) => {
            try {
                const responseChallenge = await categoryService.createCategory(req.body);
                res.status(201).json({
                    ok: true,
                    responseChallenge,
                });
            }
            catch (error) {
                if (error instanceof Error) {
                    res.status(500).json({ ok: error.message });
                }
            }
        };
        this.getcategory = async (req, res) => {
            const { id } = req.body;
            try {
                const result = await categoryService.getCategory(id);
                res.status(200).json({ ok: true, result });
            }
            catch (err) {
                if (err instanceof Error) {
                    res.status(500).json({ ok: err.message });
                }
            }
        };
        this.deletecategory = async (req, res) => {
            const { id } = req.body;
            try {
                await categoryService.deleteCategory(id);
                res.status(200).json({ ok: true, message: "Categoría eliminada exitosamente" });
            }
            catch (err) {
                if (err instanceof Error) {
                    res.status(500).json({ ok: err.message });
                }
            }
        };
        this.updatecategory = async (req, res) => {
            try {
                const result = await categoryService.updateCategory(req.body);
                res.status(200).json({ ok: true, result });
            }
            catch (err) {
                if (err instanceof Error) {
                    res.status(500).json({ ok: err.message });
                }
            }
        };
    }
}
exports.default = categoryController;
//# sourceMappingURL=category-controller.js.map