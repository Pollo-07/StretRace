import { io, usersIo } from "../../../app";
import { challengeNotificationIo } from "../../../types/notificationTypes";
import { notificationTipo } from "../../../utils/notificationTipo";
import UserNotification from "../models/modelNotification";
import notificationRepository from "../ports/INotificationRepository";


export default class notificationServices {
    
    constructor(private notificationRepository:notificationRepository){}

    async createNotification(notification:UserNotification,challenge?:challengeNotificationIo):Promise<UserNotification>{


         const socketId = usersIo.get(notification.user_id)  
              const notificacionIo = {
            tipo: notification.tipo,
            mesagge: notificationTipo[notification.tipo]?.(challenge) ??  "Tienes una nueva notificación",
            fecha: new Date()
          };
        
          if(socketId){
               io.to(socketId).emit("notificacion",notificacionIo)
          }
        

        return  await this.notificationRepository.createNotification({...notification,mensaje:notificacionIo.mesagge})
        
    }

 async  getNotification (userId:string):Promise<UserNotification[]>{

    return await this.notificationRepository.getNotification(userId)

   }

    async  deleteNotification (id:string):Promise<void>{

    return await this.notificationRepository.deleteNotification(id)

   }

     async  AllNotificationsAsRead (userId:string):Promise<void>{

    return await this.notificationRepository.AllNotificationsAsRead(userId)

   }

//     async  updateNotification (notification:Partial<UserNotification>):Promise<Partial<UserNotification>>{

//     return await this.notificationRepository.updateNotification(notification)

//    }


   
}