import { EstadoReto, TipoCarrera, typesChallenges } from "../../../types/challengeTypes";



export default class Challenge{
   id: string;
   retador_id: string;
   retado_id: string;
   tipo_carrera: TipoCarrera;
   vehiculo_retador_id: string;
   vehiculo_retado_id: string;
   estado: EstadoReto;
   ganador_id?: string | null;
   ubicacion_acordada: string;
   fecha_acordada: Date;
   notas?: string ;
   reporte_retador_id:string | null;
   reporte_retado_id:string | null;
   created_at: Date;
   updated_at: Date;
   



    constructor(data:typesChallenges){

    this.id = data.id;
    this.retador_id = data.retador_id;
    this.retado_id = data.retado_id;
    this.tipo_carrera = data.tipo_carrera;
    this.vehiculo_retador_id = data.vehiculo_retador_id;
    this.vehiculo_retado_id = data.vehiculo_retado_id ;
    this.estado = data.estado;
    this.ganador_id = data.ganador_id;
    this.ubicacion_acordada = data.ubicacion_acordada ;
    this.fecha_acordada = data.fecha_acordada;
    this.notas = data.notas ;
    this.created_at = data.created_at ;
    this.updated_at = data.updated_at ;
    this.reporte_retado_id = data.reporte_retado_id;
    this.reporte_retador_id = data.reporte_retador_id;

    }
}