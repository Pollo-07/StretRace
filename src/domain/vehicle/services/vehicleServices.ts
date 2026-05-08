import { CloudinaryService } from "../../../infrastructure/cloudinary/cloudinary.service";
import { Vehicle } from "../models/modelVehicle";
import { vehicleRepository } from "../ports/IVehicleRepository";




export default class vehicleServices {
    
    constructor(private vehicleRepository:vehicleRepository){}

    

    async createVehicle(vehicle:Vehicle,file?:Buffer):Promise<Vehicle>{
           const cloudinary = new CloudinaryService()


      let vehiculo = {...vehicle}

         if(file){
          const urlFotoPerfil = await  cloudinary.upload(file)
          vehiculo = {
                  ...vehiculo,
                  foto: urlFotoPerfil,
               };
      }


      
        return  await this.vehicleRepository.createVehicle(vehiculo)
        
    }

 async  getVehicle (id:string):Promise<Vehicle>{

    return await this.vehicleRepository.getVehicle(id)

   }

    async  allVehicle (id:string):Promise<Vehicle[]>{

    return await this.vehicleRepository.allVehicle(id)

   }

    async  deleteVehicle (id:string):Promise<void>{

    return await this.vehicleRepository.deleteVehicle(id)

   }

    async  updateVehicle (vehicle:Partial<Vehicle>):Promise<Partial<Vehicle>>{

    return await this.vehicleRepository.updateVehicle(vehicle)

   }

      async  activeVehicle (id: string,user_id:string):Promise<void>{

    return await this.vehicleRepository.activeVehicle(id,user_id)

   }

     async  disableVehicle (id: string):Promise<void>{

    return await this.vehicleRepository.disableVehicle(id)

   }
     
     
}