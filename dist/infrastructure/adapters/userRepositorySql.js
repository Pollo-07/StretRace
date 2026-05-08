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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.userRepositorySql = void 0;
const sql = __importStar(require("mssql"));
const modelUser_1 = require("../../domain/user/models/modelUser");
const connection_1 = __importDefault(require("../database/connection"));
class userRepositorySql {
    async createUser(user) {
        const pool = await connection_1.default.getConnection();
        console.log("user", user.getPasswordHash());
        const result = await pool.request()
            .input("username", sql.VarChar, user.username)
            .input("email", sql.VarChar, user.email)
            .input("password_hash", sql.VarChar, user.getPasswordHash())
            .input("foto_perfil", sql.VarChar, user.foto_perfil)
            .input("zona_localidad", sql.VarChar, user.zona_localidad)
            .input("zona_ciudad", sql.VarChar, user.zona_ciudad)
            .input("zona_estado", sql.VarChar, user.zona_estado)
            .input("zona_pais", sql.VarChar, user.zona_pais)
            .input("rango", sql.VarChar, "D")
            .input("categoria_id", sql.UniqueIdentifier, user.categoria_id)
            .input("role", sql.VarChar, user.role)
            .query(`
      INSERT INTO Users (
        username,
        email,
        password_hash,
        foto_perfil,
        zona_localidad,
        zona_ciudad,
        zona_estado,
        zona_pais,
        rango,
        categoria_id,
        victorias,
        derrotas,
        retos_consecutivos,
        estado,
        created_at,
        updated_at,
        role

      )
      VALUES (
        @username,
        @email,
        @password_hash,
        @foto_perfil,
        @zona_localidad,
        @zona_ciudad,
        @zona_estado,
        @zona_pais,
        @rango,
        @categoria_id,
        0,
        0,
        0,
        'activo',
        GETDATE(),
        GETDATE(),
        @role
      );

      SELECT * FROM Users WHERE email = @email;
    `);
        if (!result.recordset?.length)
            throw new Error("no error al registrar un usuario");
        return new modelUser_1.User(result.recordset[0]);
    }
    async getUser(id) {
        const pool = await connection_1.default.getConnection();
        const result = await pool.request().query(`select * from Users
           where id='${id}'`);
        if (!result.recordset?.length)
            throw new Error("no se encontro el usuario");
        return new modelUser_1.User(result.recordset[0]);
    }
    async deleteUser(id) {
        const pool = await connection_1.default.getConnection();
        await pool.request().query(`DELETE FROM Users WHERE id = '${id}';`);
    }
    async updateUser(user, id, transaction) {
        const pool = await connection_1.default.getConnection();
        const request = transaction ? new sql.Request(transaction) : pool.request();
        const claveValor = [];
        for (const [clave, valor] of Object.entries(user)) {
            if (clave !== "id" && valor !== undefined && clave !== "password_hash") {
                claveValor.push(`${clave}=@${clave}`);
                request.input(clave, valor);
            }
        }
        if (claveValor.length === 0) {
            throw new Error('No hay campos para actualizar');
        }
        const result = await request.input("id", id)
            .query(`UPDATE Users SET ${claveValor.join(',')} WHERE id = @id; SELECT * FROM Users WHERE id = @id`);
        if (!result.recordset?.length)
            throw new Error("no se pudo actualizar el usuario");
        return new modelUser_1.User(result.recordset[0]);
    }
    async findByEmail(email) {
        const pool = await connection_1.default.getConnection();
        const result = await pool.request().query(`select * from Users where Users.email = '${email}'`);
        if (!result.recordset[0])
            throw new Error("no se encontro el usuario");
        return new modelUser_1.User(result.recordset[0]);
    }
    async discoverPilot(zona, userId) {
        const pool = await connection_1.default.getConnection();
        const result = await pool.request()
            .input("zona", sql.VarChar, zona)
            .input("userId", sql.VarChar, userId)
            .query(`
            select  
            u.id, u.username,u.foto_perfil,u.rango,u.victorias,u.derrotas,
            v.id  as id_vehiculo
            ,v.tipo_vehiculo,v.marca,v.foto,v.modelo
            from Users u
            join Vehicle v on v.user_id = u.id and v.activo = 1
            where u.zona_ciudad = @zona and 
            u.id <> @userId
              `);
        if (!result.recordset)
            throw new Error("no se encontro el usuario");
        return result.recordset;
    }
    async respectPilot(userId, respectUserId) {
        const pool = await connection_1.default.getConnection();
        const result = await pool.request()
            .input("userId", sql.VarChar, userId)
            .input("respectUserId", sql.VarChar, respectUserId)
            .query(`
                 insert into pilot_respect(user_id, pilot_id)
                 values(
                 @userId,
                 @respectUserId)
              `);
    }
    async getRespectPilot(userId) {
        const pool = await connection_1.default.getConnection();
        const result = await pool.request()
            .input("userId", sql.VarChar, userId)
            .query(`
                SELECT  
                  u.username,
                  u.foto_perfil,
                  u.rango,
                  u.victorias,
                  u.derrotas,
                  v.id as id_vehiculo,
                  v.tipo_vehiculo,
                  v.marca,
                  v.foto,
                  v.modelo,
                  p.pilot_id as id
                FROM pilot_respect p
                JOIN Users u ON u.id = p.pilot_id  
                LEFT JOIN Vehicle v ON v.user_id = u.id AND v.activo = 1
                WHERE p.user_id = @userId;

              `);
        return result.recordset;
    }
    //admin
    async UserAll() {
        const pool = await connection_1.default.getConnection();
        const result = await pool.request().query(`select u.*,c.nombre as CompetitionCategory 
                                               from Users u
                                             left join CompetitionCategory c 
                                              on u.categoria_id = c.id
                                              where  u.role <> 'admin'
                                              `);
        if (!result.recordset?.length)
            throw new Error("no se encontro el usuario");
        return result.recordset;
    }
    async UserAllSearch(search, offset, limit) {
        const pool = await connection_1.default.getConnection();
        const result = await pool.request()
            .input("search", `%${search}%`)
            .input("offset", offset)
            .input("limit", limit)
            .query(`
       SELECT u.*, c.nombre
        FROM Users u
        LEFT JOIN CompetitionCategory c 
          ON u.categoria_id = c.id
        WHERE u.username LIKE @search
        ORDER BY u.id
        OFFSET @offset ROWS FETCH NEXT @limit ROWS ONLY
                                              `);
        const totalPilot = await pool.request()
            .query(`
                  SELECT COUNT(*) AS total
                  FROM Users u
                `);
        if (!result.recordset?.length)
            throw new Error("no se encontro el usuario");
        return { data: result.recordset, totalUser: totalPilot.recordset[0] };
    }
    async adminFindByEmail(email) {
        const pool = await connection_1.default.getConnection();
        const result = await pool.request().query(`select * from Admins where Users.email = '${email}'`);
        if (!result.recordset[0])
            throw new Error("no se encontro el usuario");
        return result.recordset[0];
    }
}
exports.userRepositorySql = userRepositorySql;
//# sourceMappingURL=userRepositorySql.js.map