import { ParsedQs } from "qs";
import { typesDelete } from "../../../types/userTypes";
import { Category } from "../models/modelCategory";
import categoryRepository from "../ports/ICategoryRepository";

export default class categoryServices {
    
    constructor(private categoryRepository:categoryRepository){}

async createCategory(category:Category):Promise<Category>{

        return  await this.categoryRepository.createCategory(category)
        
    }

 async  getCategory (id:string | ParsedQs | (string | ParsedQs)[]):Promise<Category>{

    return await this.categoryRepository.getCategory(id)

   }

async  deleteCategory (id:string):Promise<void>{

    return await this.categoryRepository.deleteCategory(id)

   }

async  updateCategory (category:Partial<Category>):Promise<Partial<Category>>{

    return await this.categoryRepository.updateCategory(category)

   }


   
}