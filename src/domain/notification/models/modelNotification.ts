import { notificationtype, typesnotification } from "../../../types/notificationTypes";

export default class UserNotification {
  id: string;
  user_id: string;
  tipo: notificationtype;
  mensaje: string;
  leida: boolean;
  referencia_id: string;
  created_at: string;

  constructor(data: typesnotification) {

    this.id = data.id;
    this.user_id = data.user_id;
    this.tipo = data.tipo;
    this.mensaje = data.mensaje;
    this.leida = data.leida;
    this.referencia_id = data.referencia_id;
    this.created_at = data.created_at;

  }  


}