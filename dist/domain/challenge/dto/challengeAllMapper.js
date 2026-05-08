"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.challengeAllMapper = void 0;
class challengeAllMapper {
    static toDtoList(challenge) {
        return challenge.map((row) => ({
            challenge: {
                id: row.id,
                tipo_carrera: row.tipo_carrera,
                estado: row.estado,
                ubicacion_acordada: row.ubicacion_acordada,
                notas: row.notas,
                reporte_retador_id: row.reporte_retador_id,
                reporte_retado_id: row.reporte_retado_id,
                fecha_acordada: row.fecha_acordada,
            },
            challengeReport: {
                retador_ganador_id: row.retador_ganador_id,
                retador_report_description: row.retador_report_description,
                retado_ganador_id: row.retado_ganador_id,
                retado_report_description: row.retado_report_description,
            },
            retador: {
                id: row.retador_id,
                username: row.retador_username,
                foto_perfil: row.retador_fotoPerfil,
                victorias: row.retador_victorias,
                derrotas: row.retador_derrotas,
                rango: row.retador_rango,
                vehiculo: {
                    id: row.retador_vehiculoId,
                    marca: row.retador_marca,
                    modelo: row.retador_modelo,
                    tipo_vehiculo: row.retador_tipoVehiculo,
                    foto: row.retador_fotoVehiculo,
                },
            },
            retado: {
                id: row.retado_id_user,
                username: row.retado_username,
                foto_perfil: row.retado_fotoPerfil,
                victorias: row.retado_victorias,
                derrotas: row.retado_derrotas,
                rango: row.retado_rango,
                vehiculo: {
                    id: row.retado_vehiculoId,
                    marca: row.retado_marca,
                    modelo: row.retado_modelo,
                    tipo_vehiculo: row.retado_tipoVehiculo,
                    foto: row.retado_fotoVehiculo,
                },
            },
        }));
    }
}
exports.challengeAllMapper = challengeAllMapper;
//# sourceMappingURL=challengeAllMapper.js.map