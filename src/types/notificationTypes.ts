export enum notificationtype {
  reto_recibido = "reto_recibido",
  reto_aceptado = "reto_aceptado",
  reto_rechazado = "reto_rechazado",
  resultado = "resultado",
  rango_subido = "rango_subido"
}

export type typesnotification = {
  id: string;
  user_id: string;
  tipo: notificationtype;
  mensaje: string;
  leida: boolean;
  referencia_id: string ;
  created_at: string;
}

export type challengeNotificationIo ={
username?:string
rango?:string,
tipo_carrera:string,
ubicacion_acordada:string

};

 