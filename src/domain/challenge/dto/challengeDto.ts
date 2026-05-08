import { EstadoReto, TipoCarrera } from "../../../types/challengeTypes";

export interface challengeDto {
   id: string;
   retador_id: string;
   retado_id: string;
   vehiclo_retador_id: string;
   vehiculo_retado_id: string;
   tipo_carrera: TipoCarrera;
   estado: EstadoReto;
   ganador_id?: string | null;
   ubicacion_acordada: string;
   fecha_acordada: Date;
   notas?: string,
   reporte_retador_id:string | null;
  reporte_retado_id:string |null
   
}