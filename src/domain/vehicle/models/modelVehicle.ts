import { typeVehicle } from "../../../types/vehicleTypes"

export class Vehicle {
id: number
user_id :number
tipo_vehiculo:string
marca :string
modelo: String 
anio: number 
color: string 
placa: String 
foto :string 
modificaciones: string 
activo: boolean
created_at :string

    constructor(data:typeVehicle){
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