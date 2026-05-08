"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.vehicleMapper = void 0;
class vehicleMapper {
    static toDto(vehicle) {
        return {
            id: vehicle.id,
            user_id: vehicle.user_id,
            tipo_vehiculo: vehicle.tipo_vehiculo,
            marca: vehicle.marca,
            modelo: vehicle.modelo,
            color: vehicle.color,
            placa: vehicle.placa,
            foto: vehicle.foto,
            modificaciones: vehicle.modificaciones,
            activo: vehicle.activo,
            anio: vehicle.anio
        };
    }
    static toDtoList(vehicles) {
        return vehicles.map(v => this.toDto(v));
    }
}
exports.vehicleMapper = vehicleMapper;
//# sourceMappingURL=vehicleMapper.js.map