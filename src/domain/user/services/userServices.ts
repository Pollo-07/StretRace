import { CloudinaryService } from "../../../infrastructure/cloudinary/cloudinary.service";
import { typesChallengeResponse } from "../../../types/challengeTypes";
import { DiscoverUserWithVehicle, typesAdmin, typesDelete, typesUser } from "../../../types/userTypes";
import { User } from "../models/modelUser";
import { userRepository } from "../ports/IUserRepository";



export default class userServices {
    
    constructor(private userRepository:userRepository){}

   async createUser(user:User):Promise<User>{          

        return  await this.userRepository.createUser(user)
        
    }

 async  getUser (id:string):Promise<User>{

    return await this.userRepository.getUser(id)

   }

    async  deleteUser (id:string | string[]):Promise<void>{

    return await this.userRepository.deleteUser(id)

   }

    async  updateUser (user:Partial<User>,id:string,file?:Buffer):Promise<Partial<User>>{
            const cloudinary = new CloudinaryService()

      let updatedUser = { ...user }

      if(file){
          const urlFotoPerfil = await  cloudinary.upload(file)
          updatedUser = {
                  ...updatedUser,
                  foto_perfil: urlFotoPerfil,
               };
      }
   

    return await this.userRepository.updateUser(updatedUser,id)

   }

     async  findByEmail (email:string):Promise<User>{

    return await this.userRepository.findByEmail(email)

   }


  //    async  getDashboard (id:string):Promise<Dashborad>{

  //   return await this.userRepository.getDashboard(id)

  //  }

      async  discoverPilot (userId:string):Promise<DiscoverUserWithVehicle[]>{
        
        const user = await this.userRepository.getUser(userId)
        const zona =  user.zona_ciudad
      

      return await this.userRepository.discoverPilot(zona,userId)

   }


   async  respectPilot (userId:string,respectUserId:string):Promise<void>{
        
        return await this.userRepository.respectPilot(userId,respectUserId)
      


   }

     async  getrespectPilot (userId:string):Promise<DiscoverUserWithVehicle[]>{
        
        return await this.userRepository.getRespectPilot(userId)
   }



   //admin


 async  getUserAll (): Promise<User[]>{
        
        return await this.userRepository.UserAll()
   }

   
 async  getUserAllSearch (search:string,offset:number,limit:number): Promise<{data:User[],totalUser:number}>{
        
        return await this.userRepository.UserAllSearch(search,offset,limit)
   }

  

 
  





   
}