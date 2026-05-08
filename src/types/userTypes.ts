export type typesUser = {
  id: string
  username: string
  email: string
  password_hash: string
  foto_perfil: string
  zona_localidad: string
  zona_ciudad: string
  zona_estado: string
  zona_pais: string
  rango: string
  categoria_id: string
  victorias: number
  derrotas: number
  retos_consecutivos: number
  estado: string
  role:string
  created_at: Date
  updated_at: Date
  CompetitionCategory?:string
}

export type typesAdmin = {
  id: string
  username: string
  email: string
  password_hash: string
  created_at: Date
  updated_at: Date
}

import { JwtPayload } from "jsonwebtoken"
import { IRecordSet } from "mssql";

export type typesDelete = {
  recordsets: IRecordSet<any>[] | { [key: string]: IRecordSet<any> };
  recordset: IRecordSet<any> | undefined;
  output: { [key: string]: any };
  rowsAffected: number[];
}


export type Rol = "admin" | "piloto"


export interface MyPayload extends JwtPayload
 {
  userId: string;
  userName: string;
}




export type DiscoverUserWithVehicle = {
  pilot_id:string,
  username: string;
  foto_perfil: string;
  rango: string;
  victorias: number;
  derrotas: number;

  tipo_vehiculo:  string; 
  marca: string;
  modelo: string;
  foto: string; 
};