"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Vehicle = void 0;
class Vehicle {
    constructor(data) {
        this.id = data.id;
        this.user_id = data.user_id;
        this.tipo_vehiculo = data.tipo_vehiculo;
        this.marca = data.marca;
        this.modelo = data.modelo;
        this.anio = data.anio;
        this.color = data.color;
        this.placa = data.placa;
        this.foto = data.foto;
        this.modificaciones = data.modificaciones;
        this.activo = data.activo;
        this.created_at = data.created_at;
    }
}
exports.Vehicle = Vehicle;
//# sourceMappingURL=modelVehicle.js.map