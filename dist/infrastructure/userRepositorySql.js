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
exports.userRepositorySql = void 0;
const modelUser_1 = require("../domain/user/models/modelUser");
const sql = __importStar(require("mssql"));
const connection_1 = __importDefault(require("./database/connection"));
class userRepositorySql {
    createUser(user) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            const pool = yield connection_1.default.getConnection();
            console.log("user", user.getPasswordHash());
            const result = yield pool.request()
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
        updated_at
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
        GETDATE()
      );

      SELECT * FROM Users WHERE email = @email;
    `);
            if (!((_a = result.recordset) === null || _a === void 0 ? void 0 : _a.length))
                throw new Error("no error al registrar un usuario");
            return new modelUser_1.User(result.recordset[0]);
        });
    }
    getUser(id) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            const pool = yield connection_1.default.getConnection();
            const result = yield pool.request().query(`select * from Users
           where id='${id}'`);
            if (!((_a = result.recordset) === null || _a === void 0 ? void 0 : _a.length))
                throw new Error("no se encontro el usuario");
            return new modelUser_1.User(result.recordset[0]);
        });
    }
    deleteUser(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const pool = yield connection_1.default.getConnection();
            yield pool.request().query(`DELETE FROM Users WHERE id = '${id}';`);
        });
    }
    updateUser(user, id, transaction) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            const pool = yield connection_1.default.getConnection();
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
            const result = yield request.input("id", id)
                .query(`UPDATE Users SET ${claveValor.join(',')} WHERE id = @id; SELECT * FROM Users WHERE id = @id`);
            if (!((_a = result.recordset) === null || _a === void 0 ? void 0 : _a.length))
                throw new Error("no se pudo actualizar el usuario");
            return new modelUser_1.User(result.recordset[0]);
        });
    }
    findByEmail(email) {
        return __awaiter(this, void 0, void 0, function* () {
            const pool = yield connection_1.default.getConnection();
            const result = yield pool.request().query(`select * from Users where Users.email = '${email}'`);
            if (!result.recordset[0])
                throw new Error("no se encontro el usuario");
            return new modelUser_1.User(result.recordset[0]);
        });
    }
    discoverPilot(zona, userId) {
        return __awaiter(this, void 0, void 0, function* () {
            const pool = yield connection_1.default.getConnection();
            const result = yield pool.request()
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
        });
    }
    respectPilot(userId, respectUserId) {
        return __awaiter(this, void 0, void 0, function* () {
            const pool = yield connection_1.default.getConnection();
            const result = yield pool.request()
                .input("userId", sql.VarChar, userId)
                .input("respectUserId", sql.VarChar, respectUserId)
                .query(`
                 insert into pilot_respect(user_id, pilot_id)
                 values(
                 @userId,
                 @respectUserId)
              `);
        });
    }
    getRespectPilot(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            const pool = yield connection_1.default.getConnection();
            const result = yield pool.request()
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
        });
    }
    //admin
    UserAll() {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            const pool = yield connection_1.default.getConnection();
            const result = yield pool.request().query(`select u.*,c.nombre as 'CompetitionCategory' 
                                               from Users u
                                              join CompetitionCategory c 
                                              on u.categoria_id = c.id
                                              `);
            if (!((_a = result.recordset) === null || _a === void 0 ? void 0 : _a.length))
                throw new Error("no se encontro el usuario");
            return result.recordset;
        });
    }
    UserAllSearch(search, offset, limit) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            const pool = yield connection_1.default.getConnection();
            const result = yield pool.request()
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
            const totalPilot = yield pool.request()
                .query(`
                  SELECT COUNT(*) AS total
                  FROM Users u
                `);
            if (!((_a = result.recordset) === null || _a === void 0 ? void 0 : _a.length))
                throw new Error("no se encontro el usuario");
            return { data: result.recordset, totalUser: totalPilot.recordset[0] };
        });
    }
    adminFindByEmail(email) {
        return __awaiter(this, void 0, void 0, function* () {
            const pool = yield connection_1.default.getConnection();
            const result = yield pool.request().query(`select * from Admins where Users.email = '${email}'`);
            if (!result.recordset[0])
                throw new Error("no se encontro el usuario");
            return result.recordset[0];
        });
    }
}
exports.userRepositorySql = userRepositorySql;
//# sourceMappingURL=userRepositorySql.js.map