import { collapseTextChangeRangesAcrossMultipleVersions } from "typescript"
import { userRepository } from "../domain/user/ports/IUserRepository"


const RANKING = ['D', 'C', 'B', 'A', 'S']
const WINS = 2

export const  Ranking= async(  userRepository:userRepository,id_ganador:string,id_perdedor:string)=>{

    const [ganador,perdedor] = await Promise.all([
        userRepository.getUser(id_ganador),
        userRepository.getUser(id_perdedor)   
    ])
     
    const rango = ganador.rango
    
     const index = RANKING.indexOf(rango)

    const update = ganador.rango !== "S" && ganador.retos_consecutivos + 1 >=WINS

     console.log("update",update)
     console.log("retos consecutivos", ganador.retos_consecutivos + 1 )


    if(update){
        console.log("rank",index)
        const newRank = RANKING[index +1]
        console.log("newRank",newRank)
        ganador.retos_consecutivos = 0
        ganador.victorias += 1
        ganador.rango = newRank
    }else{
         ganador.victorias += 1
         ganador.retos_consecutivos +=1
         perdedor.derrotas +=1
         perdedor.retos_consecutivos = Math.max(0, perdedor.retos_consecutivos - 1)


    }

    return{
        ganador,
        perdedor

    }
}