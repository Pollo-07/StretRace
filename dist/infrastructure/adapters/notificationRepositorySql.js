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
const connection_1 = __importDefault(require("../database/connection"));
const modelNotification_1 = __importDefault(require("../../domain/notification/models/modelNotification"));
class notificationRepositorySql {
    async createNotification(notification) {
        const pool = await connection_1.default.getConnection();
        try {
            const result = await pool
                .request()
                .input("user_id", sql.UniqueIdentifier, notification.user_id)
                .input("tipo", sql.VarChar, notification.tipo)
                .input("mensaje", sql.VarChar, notification.mensaje)
                .input("leida", sql.Bit, notification.leida)
                .input("referencia_id", sql.UniqueIdentifier, notification.referencia_id)
                .query(`
            INSERT INTO Notification (
              user_id,
              tipo,
              mensaje,
              leida,
              referencia_id,
              created_at
            )
              OUTPUT INSERTED.*
            VALUES (
              @user_id,
              @tipo,
              @mensaje,
              @leida,
              @referencia_id,
              GETDATE()
            )


  `);
            return new modelNotification_1.default(result.recordset[0]);
        }
        catch (error) {
            throw error;
        }
    }
    async getNotification(userId) {
        try {
            const pool = await connection_1.default.getConnection();
            const result = await pool.request()
                .input("userId", sql.UniqueIdentifier, userId)
                .query(`select * from Notification
               where user_id=@userId
               ORDER BY created_at DESC
               `);
            if (!result.recordset?.length)
                throw new Error("no  se encontro la notiificacion o no existe");
            return result.recordset;
        }
        catch (err) {
            throw err;
        }
    }
    async deleteNotification(id) {
        try {
            const pool = await connection_1.default.getConnection();
            await pool
                .request()
                .query(`DELETE FROM Notification WHERE id = '${id}';`);
        }
        catch (error) {
            throw error;
        }
    }
    async AllNotificationsAsRead(userId) {
        try {
            const pool = await connection_1.default.getConnection();
            await pool
                .request()
                .input("userId", sql.UniqueIdentifier, userId)
                .query(`UPDATE Notification SET leida = 1 where user_id =@userId`);
        }
        catch (error) {
            throw error;
        }
    }
}
exports.default = notificationRepositorySql;
//# sourceMappingURL=notificationRepositorySql.js.map