import { notificationtype } from "../../../types/notificationTypes";

export interface notificationDto {
  id: string;
  user_id: string;
  tipo: notificationtype;
  mensaje: string;
  leida: boolean;
  referencia_id: string ;
  created_at:string
}