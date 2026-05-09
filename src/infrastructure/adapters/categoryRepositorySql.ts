
import * as sql from "mssql";
import categoryRepository from "../../domain/category/ports/ICategoryRepository";
import { Category } from "../../domain/category/models/modelCategory";
import Database from "../database/connection";

export default class categoryRepositorySql implements categoryRepository {

  async createCategory(category: Category): Promise<Category> {
    try {
      const pool = await Database.getConnection()
      const result = await pool
        .request()
        .input("nombre", sql.VarChar, category.nombre)
        .input("descripcion", sql.VarChar, category.descripcion)
        .input("activo", sql.Bit, category.activo).query(`
                INSERT INTO CompetitionCategory (
                id,
                nombre,
                descripcion,
                activo
                )
                VALUES (
                @nombre,
                @descripcion,
                @activo
                );

                SELECT * 
                FROM Category
                WHERE nombre = @nombre
                ORDER BY id DESC;
            `);



      return new Category(result.recordset[0]);
    } catch (error) {
      throw error;
    }
  }

  async getCategory(id: string): Promise<Category > {
    try {
    const pool = await Database.getConnection()  
      const result = await pool.request()
        .input("id",sql.VarChar,id)
        .query(`select * from CompetitionCategory
                   where id=@id`);
 
         if(!result.recordset[0]) throw new Error("no se encontro la competitonCategory")

      return new Category(result.recordset[0]);
    } catch (err) {
      throw err;
    }
  }

  async deleteCategory(id: string): Promise<void> {
    try {
      const pool = await Database.getConnection()
       await pool
        .request()
        .input("id",sql.VarChar,id)
        .query(`DELETE FROM CompetitionCategory WHERE id =@id;`);

    } catch (error) {
      throw error;
    }
  }

  async updateCategory(category: Partial<Category>): Promise<Category> {
    try {
      const pool = await Database.getConnection()
      const request = pool.request();

      const claveValor: string[] = [];

      for (const [clave, valor] of Object.entries(category)) {
        if (clave !== "id" && valor !== undefined) {
          claveValor.push(`${clave}=@${clave}`);
          request.input(clave, valor);
        }
      }

      if (claveValor.length === 0) {
        throw new Error("No hay campos para actualizar");
      }

      const result = await request
        .input("id", category.id)
        .query(
          `UPDATE CompetitionCategory SET ${claveValor.join(",")} WHERE id = @id; SELECT * FROM CompetitionCategory WHERE id = @id`,
        );

      if (!result.recordset[0]) throw new Error("no se puedo actualizar ");

      return new Category(result.recordset[0]);
    } catch (error) {
      throw error;
    }
  }
}
