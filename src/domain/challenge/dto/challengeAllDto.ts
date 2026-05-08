
export interface challengeAllDto {
   challenge: {
    id: string;
    tipo_carrera: string;
    estado: string;
    ubicacion_acordada: string;
    notas: string | null;
    reporte_retador_id: string | null;
    reporte_retado_id: string | null;
    fecha_acordada:string,
  };

  challengeReport:{
    retador_ganador_id:string,
    retador_report_description:string,
     retado_ganador_id:string,
    retado_report_description:string,
  }

  retador: {
    id: string;
    username: string;
    foto_perfil: string;
    victorias: number;
    derrotas: number;
    rango: string;

    vehiculo: {
      id: string;
      marca: string;
      modelo: string;
      tipo_vehiculo: string;
      foto: string;
    };
  };

  retado: {
    id: string;
    username: string;
    foto_perfil: string;
    victorias: number;
    derrotas: number;
    rango: string;

    vehiculo: {
      id: string;
      marca: string;
      modelo: string;
      tipo_vehiculo: string;
      foto: string;
    };
  };

}