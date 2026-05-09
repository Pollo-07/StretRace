
import * as sql from "mssql";
import { vehicleRepository } from "../../domain/vehicle/ports/IVehicleRepository";
import { Vehicle } from "../../domain/vehicle/models/modelVehicle";
import Database from "../database/connection";

export class vehicleRepositorySql implements vehicleRepository{

    async createVehicle(vehicle: Vehicle): Promise<Vehicle> {
    
      const pool = await Database.getConnection()    

    try{
      const result = await  pool.request()
        .input("user_id", sql.UniqueIdentifier, vehicle.user_id)
        .input("tipo_vehiculo", sql.VarChar, vehicle.tipo_vehiculo)
        .input("marca", sql.VarChar, vehicle.marca)
        .input("modelo", sql.VarChar, vehicle.modelo)
        .input("año", sql.Int, vehicle.anio)
        .input("color", sql.VarChar, vehicle.color)
        .input("placa", sql.VarChar, vehicle.placa)
        .input("foto", sql.VarChar, vehicle.foto)
        .input("modificaciones", sql.VarChar, vehicle.modificaciones)

    
        .query(`
        INSERT INTO Vehicle (
          user_id, tipo_vehiculo, marca, modelo, año, color, placa, foto, modificaciones, created_at
        )
           VALUES (
          @user_id, @tipo_vehiculo, @marca, @modelo, @año, @color, @placa, @foto, @modificaciones, GETDATE()
        )
        
        
            SELECT TOP 1 * FROM Vehicle WHERE user_id = @user_id ORDER BY created_at DESC;
      `);
          
      return new Vehicle(result.recordset[0]);

      } catch(error){
        throw error;
      }
      
    }
    
      async getVehicle(id: string): Promise<Vehicle> {
            
        try{
          const pool = await Database.getConnection()
    
        const result = await pool.request().input("id", sql.VarChar, id).query(`select * from Vehicle
               where id=@id`);
    console.log("sql result",result)
               
               if(!result.recordset[0]) throw new Error("no se encontro el Vehiculo o no existe")
    
        return new Vehicle(result.recordset[0]);

        } catch(err){
          throw err

        }
        
      }

     async allVehicle(id: string): Promise<Vehicle[]> {

        try{
          const pool = await Database.getConnection()    
        const result = await pool.request().input("user_id", sql.UniqueIdentifier, id).query(`select * from Vehicle
               where user_id=@user_id ORDER BY activo DESC`);
               
               if(!result.recordset[0]) throw new Error("no se encontro el Vehiculo o no existe")
    
        return result.recordset.map(v => new Vehicle(v));

        } catch(err){
          throw err

        }
        
      }
    
       async  deleteVehicle(id:string): Promise<void> {
        try{
          const pool = await Database.getConnection()
    
              await pool.request().input("id", sql.VarChar, id).query(`DELETE FROM Vehicle WHERE id = @id;`)    

            } catch(error){
              throw error
            }
             
      }

       async  updateVehicle(vehicle: Partial<Vehicle>): Promise<Vehicle> {
    
        try{
             const pool = await Database.getConnection()
                 const request =  pool.request(); 
    
                
                const claveValor:string[] = []
    
                for(const [clave,valor] of Object.entries(vehicle)){
                  
                  if( clave !== "id" &&valor !== undefined) {
                    claveValor.push(`${clave}=@${clave}`)
                    request.input(clave,valor)
                  }
    
                }
    
    
                if(claveValor.length === 0) { throw new Error('No hay campos para actualizar'); }
           
           
             const result = await request.input("id",vehicle.id).query(`UPDATE Vehicle SET ${claveValor.join(',')} WHERE id = @id; SELECT * FROM Vehicle WHERE id = @id`)
    
             if(!result.recordset?.length) throw new Error("no se puedo actualizar el vehicle")
      
              return new Vehicle(result.recordset[0])

        }catch(error){
          throw error
        }
                
    
      }


       async activeVehicle(id: string,user_id:string): Promise<void> {
    
        try{
              const pool = await Database.getConnection()
                 const request =  pool.request(); 
           await request.
                      input("id",id)
                      .input("user_id",user_id)
                      .query(`UPDATE Vehicle
                      SET activo = CASE 
                          WHEN id = @id THEN 1
                          ELSE 0
                      END
                      WHERE user_id =@user_id `)
        }catch(error){
          throw error
        }
                
    
      }

       async disableVehicle(id: string): Promise<void> {
    
        try{
              const pool = await Database.getConnection()
                 const request =  pool.request(); 
           
              await request.
                      input("id",id)
                      .query(`UPDATE Vehicle
                      SET activo = 0
                      WHERE id =@id `)        
      }catch(error){
          throw error
        }
                
    
      }

}