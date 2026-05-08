import UserNotification from "../models/modelNotification";
import { notificationDto } from "./notificationDto";


export class NotificationMapper {

  static toDto(notification: UserNotification): notificationDto {

    return {
      id: notification.id,
      user_id: notification.user_id,
      tipo: notification.tipo,
      mensaje: notification.mensaje,
      leida: notification.leida,
      referencia_id: notification.referencia_id,
      created_at:notification.created_at
    }

  }

}