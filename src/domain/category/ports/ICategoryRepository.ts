import { typesDelete } from "../../../types/userTypes"
import { Category } from "../models/modelCategory"
import { ParsedQs } from "qs";

export default interface categoryRepository{

            createCategory (category:Category): Promise<Category>
             getCategory (id:string | ParsedQs | (string | ParsedQs)[]): Promise<Category>
            deleteCategory(id:string): Promise<void>
            updateCategory(category:Partial<Category>): Promise<Partial<Category>>
    
}