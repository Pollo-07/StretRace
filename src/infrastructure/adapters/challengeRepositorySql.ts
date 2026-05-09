import * as sql from "mssql";
import challengeRepository from "../../domain/challenge/ports/IChallengeRepository";
import Challenge from "../../domain/challenge/models/modelChallenge";
import Database from "../database/connection";
import {
  ChallengeReport,
  typesChallengeResponse,
} from "../../types/challengeTypes";
export default class challengeRepositorySql implements challengeRepository {
  async createchallenge(challenge: Challenge): Promise<Challenge> {
    try {
      const pool = await Database.getConnection();
      const result = await pool
        .request()
        .input("retador_id", sql.UniqueIdentifier, challenge.retador_id)
        .input("retado_id", sql.UniqueIdentifier, challenge.retado_id)
        .input("tipo_carrera", sql.VarChar, challenge.tipo_carrera)
        .input(
          "vehiculo_retador_id",
          sql.UniqueIdentifier,
          challenge.vehiculo_retador_id,
        )
        .input(
          "vehiculo_retado_id",
          sql.UniqueIdentifier,
          challenge.vehiculo_retado_id,
        )
        .input("estado", sql.VarChar, challenge.estado ?? "pendiente")
        .input("ganador_id", sql.UniqueIdentifier, challenge.ganador_id ?? null)
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

      if (!result.recordset?.length)
        throw new Error("no se puedo crear el challenge");

      return new Challenge(result.recordset[0]);
    } catch (error) {
      throw error;
    }
  }

  async getchallenge(id: string): Promise<Challenge> {
    try {
      const pool = await Database.getConnection();

      const result = await pool.request().input("id", sql.VarChar, id).query(`select * from Challenge
                   where id=@id`);

      if (!result.recordset?.length)
        throw new Error("no se encontro el challenge");

      return new Challenge(result.recordset[0]);
    } catch (err) {
      throw err;
    }
  }

  async challengeAll(id: string): Promise<typesChallengeResponse[]> {
    try {
      const pool = await Database.getConnection();

      const result = await pool.request().input("id", sql.VarChar, id).query(`
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

      if (!result.recordset?.length)
        throw new Error("no se encontro el challenge");

      return result.recordset;
    } catch (err) {
      throw err;
    }
  }

  async getMyChallengeExists(
    id_retado: string,
    id_retador: string,
  ): Promise<Challenge | null> {
    try {
      const pool = await Database.getConnection();

      const result = await pool
        .request()
        .input("retado_id", id_retado)
        .input("retador_id", id_retador).query(`
              SELECT * FROM Challenge
              WHERE retado_id = @retado_id
              AND retador_id = @retador_id
                 `);

      if (!result.recordset[0]) return null;

      return new Challenge(result.recordset[0]);
    } catch (err) {
      throw err;
    }
  }
  async deletechallenge(id: string): Promise<void> {
    try {
      const pool = await Database.getConnection();
      await pool.request().input("id", sql.VarChar, id).query(`DELETE FROM Challenge WHERE id = @id`);
    } catch (error) {
      throw error;
    }
  }

  async updatechallenge(challenge: Partial<Challenge>): Promise<Challenge> {
    try {
      const pool = await Database.getConnection();
      const request = pool.request();

      const claveValor: string[] = [];

      for (const [clave, valor] of Object.entries(challenge)) {
        if (clave !== "id" && valor !== undefined) {
          claveValor.push(`${clave}=@${clave}`);
          request.input(clave, valor);
        }
      }

      if (claveValor.length === 0) {
        throw new Error("No hay campos para actualizar");
      }

      const result = await request
        .input("id", challenge.id)
        .query(
          `UPDATE Challenge SET ${claveValor.join(",")} WHERE id = @id; SELECT * FROM Challenge WHERE id = @id`,
        );

      if (result.recordset.length === 0) {
        throw new Error("No se encontró el challenge");
      }

      return new Challenge(result.recordset[0]);
    } catch (error) {
      throw error;
    }
  }
  async acceptChallenge(id: string, id_retado: string): Promise<void> {
    try {
      const pool = await Database.getConnection();
      await pool
        .request()
        .input("id", sql.UniqueIdentifier, id)
        .input("id_retado", sql.UniqueIdentifier, id_retado)
        .query(`update Challenge 
                      set estado='aceptado'
                      where id=@id and retado_id= @id_retado `);
    } catch (err) {
      throw err;
    }
  }

  async rejectChallenge(id: string, id_retado: string): Promise<void> {
    try {
      const pool = await Database.getConnection();
      await pool
        .request()
        .input("id", sql.UniqueIdentifier, id)
        .input("id_retado", sql.UniqueIdentifier, id_retado)
        .query(`update Challenge 
                      set estado='rechazado'
                      where id=@id and retado_id= @id_retado `);
    } catch (err) {
      throw err;
    }
  }

  async startChallenge(id: string): Promise<void> {
    try {
      const pool = await Database.getConnection();

      await pool.request().input("id", sql.UniqueIdentifier, id)
        .query(`update Challenge 
                      set estado='en_curso'
                      where id=@id`);
    } catch (err) {
      throw err;
    }
  }
  async cancelChallenge(id: string): Promise<void> {
    try {
      const pool = await Database.getConnection();

      await pool.request().input("id", sql.UniqueIdentifier, id)
        .query(`update Challenge 
                      set estado='cancelado'
                      where id=@id`);
    } catch (err) {
      throw err;
    }
  }

  async completeChallenge(id: string, ganador_id: string): Promise<void> {
    try {
      const pool = await Database.getConnection();
      await pool
        .request()
        .input("id", sql.UniqueIdentifier, id)
        .input("ganador_id", sql.UniqueIdentifier, ganador_id)
        .query(`update Challenge 
                      set estado='completado', ganador_id=@ganador_id
                      where id=@id `);
    } catch (err) {
      throw err;
    }
  }

  async incompleteChallenge(id: string): Promise<void> {
    try {
      const pool = await Database.getConnection();
      await pool.request().input("id", sql.UniqueIdentifier, id)
        .query(`update Challenge 
                      set estado='resultado_pendiente'
                      where id=@id `);
    } catch (err) {
      throw err;
    }
  }

  async disputaChallenge(id: string): Promise<void> {
    try {
      const pool = await Database.getConnection();
      await pool.request().input("id", sql.UniqueIdentifier, id)
        .query(`update Challenge 
                      set estado='disputa'
                      where id=@id `);
    } catch (err) {
      throw err;
    }
  }

  async reporteChallenge(
    id: string,
    id_ganador: string,
    userId: string,
    notas: string,
  ): Promise<void> {
    try {
      const pool = await Database.getConnection();

      await pool
        .request()
        .input("id", sql.UniqueIdentifier, id)
        .input("user_id", sql.UniqueIdentifier, userId)
        .input("ganador_id", sql.UniqueIdentifier, id_ganador)
        .input("notas", sql.VarChar, notas).query(`INSERT INTO ChallengeReport (
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
    } catch (err) {
      throw err;
    }
  }

  async getReporteChallenge(id: string): Promise<ChallengeReport[]> {
    try {
      const pool = await Database.getConnection();

      const result = await pool
        .request()
        .input("id", sql.UniqueIdentifier, id)
        .query(`SELECT * FROM ChallengeReport WHERE challenge_id = @id`);

      return result.recordset;
    } catch (err) {
      throw err;
    }
  }

  //ADMIN
  async ChallengeDisputed(): Promise<typesChallengeResponse[]> {
    const pool = await Database.getConnection();

    const result = await pool.request().query(`
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
  }

  async resolveChallengeDisputed(
    id: string,
    ganador_id: string,
  ): Promise<void> {
    const pool = await Database.getConnection();

    await pool
      .request()
      .input("id", sql.VarChar, id)
      .input("ganador_id", sql.VarChar, ganador_id).query(`
                    UPDATE challenge 
                    SET estado = 'completado', ganador_id = @ganador_id
                  WHERE id = @id AND estado != 'completado';`);
  }
}
