import {Router} from "express"
import categoryController from "../controllers/category-controller";
import {
  validateCreateCategory,
  validateIdBody,
  validateUpdateCategory,
} from "../middlewares/validationMiddleware";

const categoryRouter: Router =  Router()



const categoryControllers = new categoryController();

categoryRouter.get("/category",validateIdBody,categoryControllers.getcategory)
categoryRouter.post("/createCategory",validateCreateCategory,categoryControllers.createcategory)
categoryRouter.delete("/deleteCategory",validateIdBody,categoryControllers.deletecategory)
categoryRouter.patch("/updateCategory",validateUpdateCategory,categoryControllers.updatecategory)


export default categoryRouter
