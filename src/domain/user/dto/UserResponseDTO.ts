export interface UserDTO {
  id: string
  username: string
  email:string
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
  estado: string,
  role:string
  CompetitionCategory?:string
}