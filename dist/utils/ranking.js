"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Ranking = void 0;
const RANKING = ['D', 'C', 'B', 'A', 'S'];
const WINS = 2;
const Ranking = async (userRepository, id_ganador, id_perdedor) => {
    const [ganador, perdedor] = await Promise.all([
        userRepository.getUser(id_ganador),
        userRepository.getUser(id_perdedor)
    ]);
    const rango = ganador.rango;
    const index = RANKING.indexOf(rango);
    const update = ganador.rango !== "S" && ganador.retos_consecutivos + 1 >= WINS;
    console.log("update", update);
    console.log("retos consecutivos", ganador.retos_consecutivos + 1);
    if (update) {
        console.log("rank", index);
        const newRank = RANKING[index + 1];
        console.log("newRank", newRank);
        ganador.retos_consecutivos = 0;
        ganador.victorias += 1;
        ganador.rango = newRank;
    }
    else {
        ganador.victorias += 1;
        ganador.retos_consecutivos += 1;
        perdedor.derrotas += 1;
        perdedor.retos_consecutivos = Math.max(0, perdedor.retos_consecutivos - 1);
    }
    return {
        ganador,
        perdedor
    };
};
exports.Ranking = Ranking;
//# sourceMappingURL=ranking.js.map