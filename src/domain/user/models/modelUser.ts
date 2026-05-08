
import {typesUser } from "../../../types/userTypes"
import bcrypt from "bcryptjs"

export class User {

  id: string
  username: string
  email: string
  private password_hash: string
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

  constructor(data: typesUser) {
    this.id = data.id
    this.username = data.username
    this.email = data.email
    this.password_hash = data.password_hash
    this.foto_perfil = data.foto_perfil
    this.zona_localidad = data.zona_localidad
    this.zona_ciudad = data.zona_ciudad
    this.zona_estado = data.zona_estado
    this.zona_pais = data.zona_pais
    this.rango = data.rango
    this.categoria_id = data.categoria_id
    this.victorias = data.victorias
    this.derrotas = data.derrotas
    this.retos_consecutivos = data.retos_consecutivos
    this.estado = data.estado
    this.role = data.role
    this.created_at = data.created_at
    this.updated_at = data.updated_at
    this.CompetitionCategory = data.CompetitionCategory
  }



  public comparePassword(password:string){
     return bcrypt.compare(password,this.password_hash)
  }
  
   getPasswordHash(): string {
    return bcrypt.hashSync(this.password_hash, 10);
  }

}