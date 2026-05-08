import { Vehicle } from "../models/modelVehicle";
import { vehicleDto } from "./vehicleDto";



export class vehicleMapper {

  static toDto(vehicle: Vehicle): vehicleDto {

    return {
          id: vehicle.id,
          user_id :vehicle.user_id,
          tipo_vehiculo:vehicle.tipo_vehiculo,
          marca :vehicle.marca,
          modelo: vehicle.modelo,
          color: vehicle.color,
          placa: vehicle.placa,
          foto :vehicle.foto,
          modificaciones: vehicle.modificaciones, 
          activo: vehicle.activo,
          anio:vehicle.anio
    }

  }

  static toDtoList(vehicles: Vehicle[]): vehicleDto[] {
  return vehicles.map(v => this.toDto(v));
}
}

