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
const modelNotification_1 = __importDefault(require("../domain/notification/models/modelNotification"));
const connection_1 = require("./database/connection");
const sql = __importStar(require("mssql"));
class notificationRepositorySql {
    createNotification(notification) {
        return __awaiter(this, void 0, void 0, function* () {
            const pool = yield (0, connection_1.getConnection)();
            try {
                const result = yield pool
                    .request()
                    .input("user_id", sql.UniqueIdentifier, notification.user_id)
                    .input("tipo", sql.VarChar, notification.tipo)
                    .input("mensaje", sql.VarChar, notification.mensaje)
                    .input("leida", sql.Bit, notification.leida)
                    .input("referencia_id", sql.UniqueIdentifier, notification.referencia_id)
                    .input("created_at", sql.VarChar, notification.created_at).query(`
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
      @created_at
    )


  `);
                return new modelNotification_1.default(result.recordset[0]);
            }
            catch (error) {
                throw error;
            }
        });
    }
    getNotification(id) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            try {
                const pool = yield (0, connection_1.getConnection)();
                const result = yield pool.request().query(`select * from Notification
               where id='${id}'`);
                if (!((_a = result.recordset) === null || _a === void 0 ? void 0 : _a.length))
                    throw new Error("no  se encontro la notiificacion o no existe");
                return new modelNotification_1.default(result.recordset[0]);
            }
            catch (err) {
                throw err;
            }
        });
    }
    deleteNotification(id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const pool = yield (0, connection_1.getConnection)();
                const result = yield pool
                    .request()
                    .query(`DELETE FROM Notification WHERE id = '${id}';`);
                return result;
            }
            catch (error) {
                throw error;
            }
        });
    }
    updateNotification(vehicle) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            try {
                const pool = yield (0, connection_1.getConnection)();
                const request = pool.request();
                console.log(vehicle);
                const claveValor = [];
                for (const [clave, valor] of Object.entries(vehicle)) {
                    if (clave !== "id" && valor !== undefined) {
                        claveValor.push(`${clave}=@${clave}`);
                        request.input(clave, valor);
                    }
                }
                if (claveValor.length === 0) {
                    throw new Error("No hay campos para actualizar");
                }
                const result = yield request
                    .input("id", vehicle.id)
                    .query(`UPDATE Notification SET ${claveValor.join(",")} WHERE id = @id; SELECT * FROM Notification WHERE id = @id`);
                if (!((_a = result.recordset) === null || _a === void 0 ? void 0 : _a.length))
                    throw new Error("no se pudo actualizar la notificacion");
                return new modelNotification_1.default(result.recordset[0]);
            }
            catch (error) {
                throw error;
            }
        });
    }
}
exports.default = notificationRepositorySql;
//# sourceMappingURL=notifictionRepositorySql.js.map