import { ChallengeReport, typesChallengeResponse } from "../../../types/challengeTypes";
import { typesDelete } from "../../../types/userTypes"
import Challenge from "../models/modelChallenge"
import * as sql from "mssql";
export default interface challengeRepository{

     createchallenge (chanllenge:Challenge
     ): Promise<Challenge>
     getchallenge (id:string): Promise<Challenge>
     challengeAll (id:string): Promise<typesChallengeResponse[] >
    deletechallenge(id:string): Promise<void>
    updatechallenge(challenge:Partial<Challenge>):Promise<Partial<Challenge>>


    getMyChallengeExists(id_retado:string,id_retador:string):Promise<Challenge | null>
    
    acceptChallenge(id:string,id_retado:string):Promise<void>
    rejectChallenge(id:string,id_retado:string):Promise<void>

    reporteChallenge(id:string,id_ganador:string,userId:string,notas:string):Promise<void>
    getReporteChallenge(id:string):Promise<ChallengeReport[]>

    completeChallenge(id:string,ganador_id:string):Promise<void>
    incompleteChallenge(id:string):Promise<void>
    disputaChallenge(id:string):Promise<void>
    cancelChallenge(id:string):Promise<void>
    startChallenge(id:string):Promise<void>


     //admin
    ChallengeDisputed():Promise<typesChallengeResponse[]>
    resolveChallengeDisputed(id:string,ganador_id:string):Promise<void>


    

}