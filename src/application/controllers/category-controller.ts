import { Request, Response } from "express";
import categoryServices from "../../domain/category/services/categoryServices";
import categoryRepositorySql from "../../infrastructure/adapters/categoryRepositorySql";


const repositoryCategory = new categoryRepositorySql()
const categoryService = new categoryServices(repositoryCategory)

export default class categoryController {


  createcategory = async (req: Request, res: Response) => {
    try {
      const responseChallenge = await categoryService.createCategory(
        req.body,
      );

      res.status(201).json({
        ok: true,
        responseChallenge,
      });
    } catch (error) {
      if (error instanceof Error) {
      res.status(500).json({ ok: error.message });
    }}
  };

  getcategory = async (req: Request, res: Response) => {
    const { id } = req.body

    try {
      const result = await categoryService.getCategory(id);
      res.status(200).json({ ok: true, result });
    } catch (err) {
      if (err instanceof Error) {
      res.status(500).json({ ok: err.message });
    }}
  };

  deletecategory = async (req: Request, res: Response) => {
    const { id } = req.body;

    try {
      await categoryService.deleteCategory(id);
      res.status(200).json({ ok: true, message: "Categoría eliminada exitosamente" });
    } catch (err) {
      if (err instanceof Error) {
      res.status(500).json({ ok: err.message });
    }}
  };

  updatecategory = async (req: Request, res: Response) => {
    try {
      const result = await categoryService.updateCategory(req.body);

      res.status(200).json({ ok: true, result });
    } catch (err) 
    {if (err instanceof Error) {
      res.status(500).json({ ok: err.message });
    }}
  };
}
