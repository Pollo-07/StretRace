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
const sql = __importStar(require("mssql"));
const modelCategory_1 = require("../../domain/category/models/modelCategory");
const connection_1 = __importDefault(require("../database/connection"));
class categoryRepositorySql {
    async createCategory(category) {
        try {
            const pool = await connection_1.default.getConnection();
            const result = await pool
                .request()
                .input("nombre", sql.VarChar, category.nombre)
                .input("descripcion", sql.VarChar, category.descripcion)
                .input("activo", sql.Bit, category.activo).query(`
                INSERT INTO CompetitionCategory (
                id,
                nombre,
                descripcion,
                activo
                )
                VALUES (
                @nombre,
                @descripcion,
                @activo
                );

                SELECT * 
                FROM Category
                WHERE nombre = @nombre
                ORDER BY id DESC;
            `);
            return new modelCategory_1.Category(result.recordset[0]);
        }
        catch (error) {
            throw error;
        }
    }
    async getCategory(id) {
        try {
            const pool = await connection_1.default.getConnection();
            const result = await pool.request()
                .query(`select * from CompetitionCategory
                   where id='${id}'`);
            if (!result.recordset[0])
                throw new Error("no se encontro la competitonCategory");
            return new modelCategory_1.Category(result.recordset[0]);
        }
        catch (err) {
            throw err;
        }
    }
    async deleteCategory(id) {
        try {
            const pool = await connection_1.default.getConnection();
            await pool
                .request()
                .query(`DELETE FROM CompetitionCategory WHERE id = '${id}';`);
        }
        catch (error) {
            throw error;
        }
    }
    async updateCategory(category) {
        try {
            const pool = await connection_1.default.getConnection();
            const request = pool.request();
            const claveValor = [];
            for (const [clave, valor] of Object.entries(category)) {
                if (clave !== "id" && valor !== undefined) {
                    claveValor.push(`${clave}=@${clave}`);
                    request.input(clave, valor);
                }
            }
            if (claveValor.length === 0) {
                throw new Error("No hay campos para actualizar");
            }
            const result = await request
                .input("id", category.id)
                .query(`UPDATE CompetitionCategory SET ${claveValor.join(",")} WHERE id = @id; SELECT * FROM CompetitionCategory WHERE id = @id`);
            if (!result.recordset[0])
                throw new Error("no se puedo actualizar ");
            return new modelCategory_1.Category(result.recordset[0]);
        }
        catch (error) {
            throw error;
        }
    }
}
exports.default = categoryRepositorySql;
//# sourceMappingURL=categoryRepositorySql.js.map