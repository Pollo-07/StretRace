import { User } from "../models/modelUser";
import { UserDTO } from "./UserResponseDTO";



export class userMapper {

  static toDto(user: User): UserDTO {

    return {
          id: user.id,
          username: user.username,
          email:user.email,
          foto_perfil: user.foto_perfil,
          zona_localidad: user.zona_localidad,
          zona_ciudad: user.zona_ciudad,
          zona_estado: user.zona_estado,
          zona_pais: user.zona_pais,
          rango: user.rango,
          categoria_id: user.categoria_id,
          victorias: user.victorias,
          derrotas: user.derrotas,
          retos_consecutivos: user.retos_consecutivos,
          estado:user.estado,
          role:user.role,
          CompetitionCategory:user.CompetitionCategory
    }

  }

  static toDtoList(users: User[]): UserDTO[] {
    return users.map(userMapper.toDto);
  }

}