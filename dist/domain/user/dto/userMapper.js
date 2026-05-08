"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.userMapper = void 0;
class userMapper {
    static toDto(user) {
        return {
            id: user.id,
            username: user.username,
            email: user.email,
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
            estado: user.estado,
            role: user.role,
            CompetitionCategory: user.CompetitionCategory
        };
    }
    static toDtoList(users) {
        return users.map(userMapper.toDto);
    }
}
exports.userMapper = userMapper;
//# sourceMappingURL=userMapper.js.map