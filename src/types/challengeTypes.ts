

export type typesChallenges ={
  id: string;
   retador_id: string;
   retado_id: string;
   tipo_carrera: TipoCarrera;
   vehiculo_retador_id: string;
   vehiculo_retado_id: string;
   estado: EstadoReto;
   ganador_id?: string ;
   ubicacion_acordada: string;
   fecha_acordada: Date;
   notas?: string ;
    reporte_retador_id:string;
 reporte_retado_id:string;
   created_at: Date;
   updated_at: Date;
}


// export type typesChallengeResponse ={
//   id: string;
//    retador_id: string;
//    retado_id: string;
//    tipo_carrera: TipoCarrera;
//    vehiculo_retador_id: string;
//    vehiculo_retado_id: string;
//    estado: EstadoReto;
//    ganador_id: string;
//    reporte_retador_id:string | null;
//   reporte_retado_id:string |null
//    ubicacion_acordada: string;
//    fecha_acordada: Date;
//    notas: string;
//    created_at: Date;
//    updated_at: Date;
//   retador_username: string;
//    retador_victorias: number;
//    retador_derrotas: number;
//    retador_marca: string;
//    retador_modelo: string;

// }


export type typesChallengeResponse = {
 
  id: string;
  tipo_carrera: string;
  estado: string;
  ubicacion_acordada: string;
  notas: string | null;
  reporte_retador_id: string | null;
  reporte_retado_id: string | null;
  fecha_acordada:string

  retador_ganador_id:string,
  retador_report_description:string,
  retado_ganador_id:string,
  retado_report_description:string,

 
  retador_id: string;
  retador_fotoPerfil: string;
  retador_username: string;
  retador_victorias: number;
  retador_derrotas: number;
  retador_rango: string;
  retador_vehiculoId: string;
  retador_marca: string;
  retador_modelo: string;
  retador_tipoVehiculo: string;
  retador_fotoVehiculo: string;

  
  retado_id_user: string;
  retado_fotoPerfil: string;
  retado_username: string;
  retado_victorias: number;
  retado_derrotas: number;
  retado_rango: string;
  retado_vehiculoId: string;
  retado_marca: string;
  retado_modelo: string;
  retado_tipoVehiculo: string;
  retado_fotoVehiculo: string;
};


export type TipoCarrera = "cuarto_milla" | "vueltas" | "derrape";

export type EstadoReto =
  | "pendiente"
  | "aceptado"
  | "rechazado"
  | "en_curso"
  | "completado"
  | "cancelado"
  | "disputa"
  | "resultado_pendiente";


  export type EstadosActivos = [
  "resultado_pendiente",
  "disputa",
  "pendiente",
  "aceptado",
  "en_curso"
];


  export type ChallengeReport={
    id:string,
    challenge_id:string,
    user_id:string,
    ganador_id:string,
    description:string,
  }