import { typesChallengeResponse ,EstadosActivos} from "../../../types/challengeTypes";
import { challengeNotificationIo } from "../../../types/notificationTypes";
import { Ranking } from "../../../utils/ranking";
import UserNotification from "../../notification/models/modelNotification";
import notificationServices from "../../notification/services/notificationServices";
import { userRepository } from "../../user/ports/IUserRepository";
import { vehicleRepository } from "../../vehicle/ports/IVehicleRepository";


import Challenge from "../models/modelChallenge";
import challengeRepository from "../ports/IChallengeRepository";

export default class challengeServices {
  constructor(
    private challengeRepository: challengeRepository,
    private vehicleRepository: vehicleRepository,
    private userRepository: userRepository,
    private notificationServicie : notificationServices
  ) {}

async createchallenge(challenge: Challenge,notification:UserNotification): Promise<Challenge> {
    const { retado_id, retador_id, vehiculo_retado_id, vehiculo_retador_id } =
      challenge;
    const estadosActivos =[ "resultado_pendiente","disputa","pendiente","aceptado","en_curso"];

    const userRetado = await this.userRepository.getUser(retado_id);

    const userRetador = await this.userRepository.getUser(retador_id);

       const challengeNotificationIo = {
            username:userRetador.username,
            rango:userRetador.rango,
            tipo_carrera:challenge.tipo_carrera,
            ubicacion_acordada:challenge.ubicacion_acordada
      }
    

    const vehicleRetado =
      await this.vehicleRepository.getVehicle(vehiculo_retado_id);

    const vehicleRetador =
      await this.vehicleRepository.getVehicle(vehiculo_retador_id);

    const challengeExists = await this.challengeRepository.getMyChallengeExists(
      retado_id,
      retador_id,
    );

        if (challengeExists && estadosActivos.includes(challengeExists.estado)) {
          throw new Error("Ya existe un reto entre ambos pilotos");
        }

    if ( userRetado.rango !== userRetador.rango || vehicleRetado.tipo_vehiculo !== vehicleRetador.tipo_vehiculo)
      throw new Error("no se puede retar a un piloto de otro rango o diferente vehiculo",);

    if (vehicleRetado.activo === false || vehicleRetador.activo === false)
      throw new Error("necesitas tener un vehiculo activo");

    const challengeResponse = await this.challengeRepository.createchallenge(challenge);
    
    if(challengeResponse){
       await this.notificationServicie.createNotification({...notification,referencia_id:challengeResponse.id},challengeNotificationIo)

    }


    return challengeResponse

    
     
    
  }

async getchallenge(id: string): Promise<Challenge> {
    return await this.challengeRepository.getchallenge(id);
  }

async challengeAll(id: string): Promise<typesChallengeResponse[]> {
    return await this.challengeRepository.challengeAll(id);
  }


async updatechallenge(
    challenge: Partial<Challenge>,
  ): Promise<Partial<Challenge>> {
    return await this.challengeRepository.updatechallenge(challenge);
  }

async deletechallenge(id: string): Promise<void> {
    return await this.challengeRepository.deletechallenge(id);
  }

async acceptChallenge(id: string, id_retado: string,notification:UserNotification): Promise<void> {
    const challenge = await this.challengeRepository.getchallenge(id);
   
    if (!challenge) throw new Error("no se encontro el challenge");

     const userRetador = await this.userRepository.getUser(challenge?.retador_id)

      const challengeNotificationIo = {
            username:userRetador.username,
            rango:userRetador.rango,
            tipo_carrera:challenge.tipo_carrera,
            ubicacion_acordada:challenge.ubicacion_acordada
      }

    if (challenge.retado_id !== id_retado)
      throw new Error("solo el retado lo puede aceptar");

    if (challenge.estado !== "pendiente")
      throw new Error(
        `solo se puede aceptar un reto en estado: ${challenge.estado}`,
      );

       await this.notificationServicie.createNotification({...notification,referencia_id:challenge.id},challengeNotificationIo)

    return await this.challengeRepository.acceptChallenge(id, id_retado);
  }

async rejectChallenge(id: string, id_retado: string,notification:UserNotification): Promise<void> {
    const challenge = await this.challengeRepository.getchallenge(id);
  
    if (!challenge) throw new Error("no se encontro el challenge");

      const userRetador = await this.userRepository.getUser(challenge.retador_id)

      const challengeNotificationIo = {
            username:userRetador.username,
            rango:userRetador.rango,
            tipo_carrera:challenge.tipo_carrera,
            ubicacion_acordada:challenge.ubicacion_acordada
      }

    if (challenge.retado_id !== id_retado)
      throw new Error("solo el retado lo puede rechazar");

    if (challenge.estado !== "pendiente")
      throw new Error(`solo se puede rechazar un reto en estado pediente`);

   await this.notificationServicie.createNotification(notification,challengeNotificationIo)

    return await this.challengeRepository.rejectChallenge(id, id_retado);
  }

async startChallenge(id: string): Promise<void> {

    const challenge = await this.challengeRepository.getchallenge(id);

    if (!challenge) throw new Error("no se encontro el challenge");

    if (challenge.estado !== "aceptado")
      throw new Error(`solo se puede iniciar  un reto en estado aceptado`);

    return await this.challengeRepository.startChallenge(id);
  }

async cancelChallenge(id: string): Promise<void> {
    const challenge = await this.challengeRepository.getchallenge(id);

    if (!challenge) throw new Error("no se encontro el challenge");

    if (!["en_curso", "aceptado"].includes(challenge.estado))
      throw new Error(
        `solo se puede cancelar un reto en estado en curso o aceptado`,
      );

    return await this.challengeRepository.cancelChallenge(id);
  }

async completeChallenge(id: string, ganador_id: string,notification:UserNotification[],challengeNotificationIo:challengeNotificationIo): Promise<void> {
  
  try {

          const Pilot1 = notification[0]
          const Pilot2 = notification[1]


           await this.notificationServicie.createNotification(Pilot1,challengeNotificationIo)
            await this.notificationServicie.createNotification(Pilot2,challengeNotificationIo)

    return await this.challengeRepository.completeChallenge( id, ganador_id);   
  } catch (error) {
    throw error;
  }
}

async incompleteChallenge(id: string): Promise<void> {
 
  try {
    return await this.challengeRepository.incompleteChallenge( id);   
  } catch (error) {
    throw error;
  }
}

async disputateChallenge(id: string,): Promise<void> {
 
  try {
    return await this.challengeRepository.disputaChallenge( id);   
  } catch (error) {
    throw error;
  }
}

async reporteChallenge(id: string, id_ganador: string, userId: string,notas:string,notification:UserNotification[]): Promise<void> {

  try {
    const challenge = await this.challengeRepository.getchallenge(id);

    if (!challenge) throw new Error("no se encontro el challenge");

    
    if(!["en_curso","resultado_pendiente"].includes(challenge.estado)){
            throw new Error("solo se puede completar un reto en estado en curso");
    }
 

    if (![challenge.retado_id, challenge.retador_id].includes(id_ganador)) {
      throw new Error("el ganador debe ser uno de los participantes");
    }

    //  Guardar el reporte primero
    await this.challengeRepository.reporteChallenge(id, id_ganador, userId,notas);

    //  Volver a consultar actualizado
    const reportes = await this.challengeRepository.getReporteChallenge(id)
     
    const reporteRetador = reportes.find(
          (r) => r.user_id === challenge.retador_id
        );

    const reporteRetado = reportes.find(
          (r) => r.user_id === challenge.retado_id
        );
  
        
    if (!reporteRetado || !reporteRetador) { 
           await this.challengeRepository.incompleteChallenge(id);

    } else if (reporteRetado.ganador_id=== reporteRetador.ganador_id) {

                const challengeNotificationIo = {
                  tipo_carrera:challenge.tipo_carrera,
                  ubicacion_acordada:challenge.ubicacion_acordada
              }

     
      await this.completeChallenge(id, id_ganador, notification.map(n => ({
        ...n,
        referencia_id: challenge.id
      })),challengeNotificationIo);

      const id_perdedor =  id_ganador === challenge.retado_id
          ? challenge.retador_id
          : challenge.retado_id;

      const { ganador, perdedor } = await Ranking(
        this.userRepository,
        id_ganador,
        id_perdedor
      );

      await Promise.all([
        this.userRepository.updateUser(ganador, ganador.id),
        this.userRepository.updateUser(perdedor, perdedor.id),
      ]);

    } else {
      await this.challengeRepository.disputaChallenge(id);
    }

  
  } catch (error) {
    throw error;
  }
}

async  getChallengeDisputed ():Promise<typesChallengeResponse[]>{
        
        return await this.challengeRepository.ChallengeDisputed()
   }
async  resolveChallengeDisputed (id:string,ganador_id:string):Promise<void>{
        
        return await this.challengeRepository.resolveChallengeDisputed(id,ganador_id)
   }


}
