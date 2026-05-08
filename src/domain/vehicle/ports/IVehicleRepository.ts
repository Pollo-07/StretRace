import { typesDelete } from "../../../types/userTypes"
import { Vehicle } from "../models/modelVehicle"

export  interface vehicleRepository {
     createVehicle (vehicle:Vehicle): Promise<Vehicle>
         getVehicle (id:string): Promise<Vehicle>
        allVehicle (id:string): Promise<Vehicle[]>
        deleteVehicle(id:string): Promise<void>
        updateVehicle(vehicle:Partial<Vehicle>): Promise<Partial<Vehicle>>
        activeVehicle(id: string,user_id:string): Promise<void>
        disableVehicle(id: string):  Promise<void>
}