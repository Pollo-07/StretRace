import { typesChallengeResponse } from "../../../types/challengeTypes";
import Challenge from "../models/modelChallenge";
import { challengeDto } from "./challengeDto";



export class challengeMapper {

  static toDto(challenge:Challenge ): challengeDto {

    return {
         id: challenge.id,
         retador_id: challenge.retador_id,
         retado_id: challenge.retado_id,
         tipo_carrera: challenge.tipo_carrera,
          vehiclo_retador_id: challenge.vehiculo_retador_id,
         vehiculo_retado_id: challenge.vehiculo_retado_id,

         estado: challenge.estado,
         ganador_id:challenge.ganador_id,
         ubicacion_acordada:challenge.ubicacion_acordada,
         fecha_acordada: challenge.fecha_acordada,
         notas:challenge.notas,
         reporte_retador_id:challenge.reporte_retador_id,
         reporte_retado_id:challenge.reporte_retado_id

    }

  }


   
}