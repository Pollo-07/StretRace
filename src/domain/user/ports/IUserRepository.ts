import { DiscoverUserWithVehicle, typesAdmin, typesDelete, typesUser } from "../../../types/userTypes"
import { User } from "../models/modelUser"
import * as sql from "mssql";


export  interface userRepository {
    createUser (user:User): Promise<User>
    getUser (id:string,transaction?:sql.Transaction): Promise<User>
    deleteUser(id:string | string[]): Promise<void>
    updateUser(user:Partial<User>,id:string,transaction?:sql.Transaction): Promise<Partial<User>>
    
    findByEmail(email:string): Promise<User>
    discoverPilot(zona:string,userId:string):Promise<DiscoverUserWithVehicle[]>
    respectPilot(userId:string,respectUserId:string):Promise<void>
    getRespectPilot(userId:string):Promise<DiscoverUserWithVehicle[]>

    


    //ADMIN
    UserAll(): Promise<User[]>
    UserAllSearch(search:string,offset:number,limit:number): Promise<{data:User[],totalUser:number}>


   
        


}