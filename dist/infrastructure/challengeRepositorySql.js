"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const modelChallenge_1 = __importDefault(require("../domain/challenge/models/modelChallenge"));
const sql = __importStar(require("mssql"));
const connection_1 = __importDefault(require("./database/connection"));
class challengeRepositorySql {
    createchallenge(challenge) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a, _b, _c;
            try {
                const pool = yield connection_1.default.getConnection();
                const result = yield pool
                    .request()
                    .input("retador_id", sql.UniqueIdentifier, challenge.retador_id)
                    .input("retado_id", sql.UniqueIdentifier, challenge.retado_id)
                    .input("tipo_carrera", sql.VarChar, challenge.tipo_carrera)
                    .input("vehiculo_retador_id", sql.UniqueIdentifier, challenge.vehiculo_retador_id)
                    .input("vehiculo_retado_id", sql.UniqueIdentifier, challenge.vehiculo_retado_id)
                    .input("estado", sql.VarChar, (_a = challenge.estado) !== null && _a !== void 0 ? _a : "pendiente")
                    .input("ganador_id", sql.UniqueIdentifier, (_b = challenge.ganador_id) !== null && _b !== void 0 ? _b : null)
                    .input("ubicacion_acordada", sql.VarChar, challenge.ubicacion_acordada)
                    .input("fecha_acordada", sql.DateTime, challenge.fecha_acordada)
                    .input("notas", sql.VarChar, challenge.notas).query(`
            INSERT INTO Challenge (
            retador_id,
            retado_id,
            tipo_carrera,
            vehiculo_retador_id,
            vehiculo_retado_id,
            estado,
            ganador_id,
            ubicacion_acordada,
            fecha_acordada,
            notas,
            created_at,
            updated_at
            )
            VALUES (
            @retador_id,
            @retado_id,
            @tipo_carrera,
            @vehiculo_retador_id,
            @vehiculo_retado_id,
            @estado,
            @ganador_id,
            @ubicacion_acordada,
            @fecha_acordada,
            @notas,
            GETDATE(),
            GETDATE()
            );

            SELECT Top 1 * FROM Challenge 
            WHERE retador_id = @retador_id 
            AND retado_id = @retado_id
            ORDER BY created_at DESC;
        `);
                if (!((_c = result.recordset) === null || _c === void 0 ? void 0 : _c.length))
                    throw new Error("no se puedo crear el challenge");
                return new modelChallenge_1.default(result.recordset[0]);
            }
            catch (error) {
                throw error;
            }
        });
    }
    getchallenge(id) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            try {
                const pool = yield connection_1.default.getConnection();
                const result = yield pool.request().query(`select * from Challenge
                   where id='${id}'`);
                if (!((_a = result.recordset) === null || _a === void 0 ? void 0 : _a.length))
                    throw new Error("no se encontro el challenge");
                return new modelChallenge_1.default(result.recordset[0]);
            }
            catch (err) {
                throw err;
            }
        });
    }
    challengeAll(id) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            try {
                const pool = yield connection_1.default.getConnection();
                const result = yield pool.request()
                    .input("id", sql.VarChar, id)
                    .query(`
                   SELECT 
                        c.id,
                        c.tipo_carrera,
                        c.estado,
                        c.ubicacion_acordada,
                        c.notas,
                        c.fecha_acordada,

                        -- REPORTES
                        cr_retador.ganador_id AS retador_ganador_id,
                        cr_retador.description AS retador_report_description,

                        cr_retado.ganador_id AS retado_ganador_id,
                        cr_retado.description AS retado_report_description,

                        -- RETADOR (usuario)
                        u_retador.id AS retador_id,
                        u_retador.foto_perfil AS retador_fotoPerfil,
                        u_retador.username AS retador_username,
                        u_retador.victorias AS retador_victorias,
                        u_retador.derrotas AS retador_derrotas,
                        u_retador.rango AS retador_rango,

                        -- RETADOR (vehículo)
                        v_retador.id AS retador_vehiculoId,
                        v_retador.marca AS retador_marca,
                        v_retador.modelo AS retador_modelo,
                        v_retador.tipo_vehiculo AS retador_tipoVehiculo,
                        v_retador.foto AS retador_fotoVehiculo,

                        -- RETADO (usuario)
                        u_retado.id AS retado_id_user,
                        u_retado.foto_perfil AS retado_fotoPerfil,
                        u_retado.username AS retado_username,
                        u_retado.victorias AS retado_victorias,
                        u_retado.derrotas AS retado_derrotas,
                        u_retado.rango AS retado_rango,

                        -- RETADO (vehículo)
                        v_retado.id AS retado_vehiculoId,
                        v_retado.marca AS retado_marca,
                        v_retado.modelo AS retado_modelo,
                        v_retado.tipo_vehiculo AS retado_tipoVehiculo,
                        v_retado.foto AS retado_fotoVehiculo

                    FROM Challenge c

                    --- REPORTES 
                    LEFT JOIN ChallengeReport cr_retador
                        ON cr_retador.challenge_id = c.id 
                        AND cr_retador.user_id = c.retador_id

                    LEFT JOIN ChallengeReport cr_retado
                        ON cr_retado.challenge_id = c.id 
                        AND cr_retado.user_id = c.retado_id

                    -- RETADOR
                    INNER JOIN [Users] u_retador 
                        ON c.retador_id = u_retador.id

                    INNER JOIN [Vehicle] v_retador 
                        ON c.vehiculo_retador_id = v_retador.id

                    -- RETADO
                    INNER JOIN [Users] u_retado 
                        ON c.retado_id = u_retado.id

                    INNER JOIN [Vehicle] v_retado 
                        ON c.vehiculo_retado_id = v_retado.id

                    WHERE (c.retado_id =@id OR c.retador_id =@id)
                    AND c.estado IN ('aceptado', 'en_curso', 'pendiente', 'resultado_pendiente','disputa');

            `);
                if (!((_a = result.recordset) === null || _a === void 0 ? void 0 : _a.length))
                    throw new Error("no se encontro el challenge");
                return result.recordset;
            }
            catch (err) {
                throw err;
            }
        });
    }
    getMyChallengeExists(id_retado, id_retador) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const pool = yield connection_1.default.getConnection();
                const result = yield pool
                    .request()
                    .input("retado_id", id_retado)
                    .input("retador_id", id_retador)
                    .query(`
              SELECT * FROM Challenge
              WHERE retado_id = @retado_id
              AND retador_id = @retador_id
                 `);
                if (!result.recordset[0])
                    return null;
                return new modelChallenge_1.default(result.recordset[0]);
            }
            catch (err) {
                throw err;
            }
        });
    }
    deletechallenge(id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const pool = yield connection_1.default.getConnection();
                const result = yield pool
                    .request()
                    .query(`DELETE FROM Challenge WHERE id = '${id}'`);
                return result;
            }
            catch (error) {
                throw error;
            }
        });
    }
    updatechallenge(challenge) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const pool = yield connection_1.default.getConnection();
                const request = pool.request();
                const claveValor = [];
                for (const [clave, valor] of Object.entries(challenge)) {
                    if (clave !== "id" && valor !== undefined) {
                        claveValor.push(`${clave}=@${clave}`);
                        request.input(clave, valor);
                    }
                }
                if (claveValor.length === 0) {
                    throw new Error("No hay campos para actualizar");
                }
                const result = yield request
                    .input("id", challenge.id)
                    .query(`UPDATE Challenge SET ${claveValor.join(",")} WHERE id = @id; SELECT * FROM Challenge WHERE id = @id`);
                if (result.recordset.length === 0) {
                    throw new Error("No se encontró el challenge");
                }
                return new modelChallenge_1.default(result.recordset[0]);
            }
            catch (error) {
                throw error;
            }
        });
    }
    acceptChallenge(id, id_retado) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const pool = yield connection_1.default.getConnection();
                const result = yield pool
                    .request()
                    .input("id", sql.UniqueIdentifier, id)
                    .input("id_retado", sql.UniqueIdentifier, id_retado)
                    .query(`update Challenge 
                      set estado='aceptado'
                      where id=@id and retado_id= @id_retado `);
                return result;
            }
            catch (err) {
                throw err;
            }
        });
    }
    rejectChallenge(id, id_retado) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const pool = yield connection_1.default.getConnection();
                const result = yield pool
                    .request()
                    .input("id", sql.UniqueIdentifier, id)
                    .input("id_retado", sql.UniqueIdentifier, id_retado)
                    .query(`update Challenge 
                      set estado='rechazado'
                      where id=@id and retado_id= @id_retado `);
                return result;
            }
            catch (err) {
                throw err;
            }
        });
    }
    startChallenge(id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const pool = yield connection_1.default.getConnection();
                const result = yield pool
                    .request()
                    .input("id", sql.UniqueIdentifier, id)
                    .query(`update Challenge 
                      set estado='en_curso'
                      where id=@id`);
                return result;
            }
            catch (err) {
                throw err;
            }
        });
    }
    cancelChallenge(id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const pool = yield connection_1.default.getConnection();
                const result = yield pool
                    .request()
                    .input("id", sql.UniqueIdentifier, id)
                    .query(`update Challenge 
                      set estado='cancelado'
                      where id=@id`);
                return result;
            }
            catch (err) {
                throw err;
            }
        });
    }
    completeChallenge(id, ganador_id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const pool = yield connection_1.default.getConnection();
                const result = yield pool.request().input("id", sql.UniqueIdentifier, id)
                    .input("ganador_id", sql.UniqueIdentifier, ganador_id)
                    .query(`update Challenge 
                      set estado='completado', ganador_id=@ganador_id
                      where id=@id `);
                return result;
            }
            catch (err) {
                throw err;
            }
        });
    }
    incompleteChallenge(id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const pool = yield connection_1.default.getConnection();
                const result = yield pool.request().input("id", sql.UniqueIdentifier, id)
                    .query(`update Challenge 
                      set estado='resultado_pendiente'
                      where id=@id `);
                return result;
            }
            catch (err) {
                throw err;
            }
        });
    }
    disputaChallenge(id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const pool = yield connection_1.default.getConnection();
                const result = yield pool.request().input("id", sql.UniqueIdentifier, id)
                    .query(`update Challenge 
                      set estado='disputa'
                      where id=@id `);
                return result;
            }
            catch (err) {
                throw err;
            }
        });
    }
    reporteChallenge(id, id_ganador, userId, notas) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const pool = yield connection_1.default.getConnection();
                const result = yield pool.request()
                    .input("id", sql.UniqueIdentifier, id)
                    .input("user_id", sql.UniqueIdentifier, userId)
                    .input("ganador_id", sql.UniqueIdentifier, id_ganador)
                    .input("notas", sql.VarChar, notas)
                    .query(`INSERT INTO ChallengeReport (
                              challenge_id,
                              user_id,
                              ganador_id,
                              description
                          )
                          VALUES (
                              @id,
                              @user_id,
                              @ganador_id,
                              @notas
                          );`);
                return result;
            }
            catch (err) {
                throw err;
            }
        });
    }
    getReporteChallenge(id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const pool = yield connection_1.default.getConnection();
                const result = yield pool.request().input("id", sql.UniqueIdentifier, id)
                    .query(`SELECT * FROM ChallengeReport WHERE challenge_id = @id`);
                return result.recordset;
            }
            catch (err) {
                throw err;
            }
        });
    }
    //ADMIN
    ChallengeDisputed() {
        return __awaiter(this, void 0, void 0, function* () {
            const pool = yield connection_1.default.getConnection();
            const result = yield pool.request()
                .query(`
                             SELECT 
                                  c.id,
                                  c.tipo_carrera,
                                  c.estado,
                                  c.ubicacion_acordada,
                                  c.notas,
                                  c.fecha_acordada,

                                   -- REPORTES
                                   cr_retador.ganador_id AS retador_ganador_id,
                                  cr_retador.description AS retador_report_description,
                                  
                                   cr_retado.ganador_id AS retado_ganador_id,
                                  cr_retado.description AS retado_report_description,

        
                                  -- RETADOR (usuario)
                                  u_retador.id AS retador_id,
                                  u_retador.foto_perfil AS retador_fotoPerfil,
                                  u_retador.username AS retador_username,
                                  u_retador.victorias AS retador_victorias,
                                  u_retador.derrotas AS retador_derrotas,
                                  u_retador.rango AS retador_rango,
        
                                  -- RETADOR (vehículo)
                                  v_retador.id AS retador_vehiculoId,
                                  v_retador.marca AS retador_marca,
                                  v_retador.modelo AS retador_modelo,
                                  v_retador.tipo_vehiculo AS retador_tipoVehiculo,
                                  v_retador.foto AS retador_fotoVehiculo,
        
                                  -- RETADO (usuario)
                                  u_retado.id AS retado_id_user,
                                  u_retado.foto_perfil AS retado_fotoPerfil,
                                  u_retado.username AS retado_username,
                                  u_retado.victorias AS retado_victorias,
                                  u_retado.derrotas AS retado_derrotas,
                                  u_retado.rango AS retado_rango,
        
                                  -- RETADO (vehículo)
                                  v_retado.id AS retado_vehiculoId,
                                  v_retado.marca AS retado_marca,
                                  v_retado.modelo AS retado_modelo,
                                  v_retado.tipo_vehiculo AS retado_tipoVehiculo,
                                  v_retado.foto AS retado_fotoVehiculo

                                  
        
                              FROM Challenge c

                               --- REPORTES 
                              LEFT JOIN ChallengeReport cr_retador
                                  ON cr_retador.challenge_id = c.id 
                                  AND cr_retador.user_id = c.retador_id

                              LEFT JOIN ChallengeReport cr_retado
                                  ON cr_retado.challenge_id = c.id 
                                  AND cr_retado.user_id = c.retado_id
        
                              -- RETADOR
                              INNER JOIN [Users] u_retador 
                                  ON c.retador_id = u_retador.id
        
                              INNER JOIN [Vehicle] v_retador 
                                  ON c.vehiculo_retador_id = v_retador.id
        
                              -- RETADO
                              INNER JOIN [Users] u_retado 
                                  ON c.retado_id = u_retado.id
        
                              INNER JOIN [Vehicle] v_retado 
                                  ON c.vehiculo_retado_id = v_retado.id
        
                              WHERE  c.estado = 'disputa'
                    `);
            return result.recordset;
        });
    }
    resolveChallengeDisputed(id, ganador_id) {
        return __awaiter(this, void 0, void 0, function* () {
            const pool = yield connection_1.default.getConnection();
            yield pool.request()
                .input("id", sql.VarChar, id)
                .input("ganador_id", sql.VarChar, ganador_id)
                .query(`
                    UPDATE challenge 
                    SET estado = 'completado', ganador_id = @ganador_id
                  WHERE id = @id AND estado != 'completado';`);
        });
    }
}
exports.default = challengeRepositorySql;
//# sourceMappingURL=challengeRepositorySql.js.map