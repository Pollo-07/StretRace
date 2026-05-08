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
exports.vehicleRepositorySql = void 0;
const modelVehicle_1 = require("../domain/vehicle/models/modelVehicle");
const sql = __importStar(require("mssql"));
const connection_1 = __importDefault(require("./database/connection"));
class vehicleRepositorySql {
    createVehicle(vehicle) {
        return __awaiter(this, void 0, void 0, function* () {
            const pool = yield connection_1.default.getConnection();
            try {
                const result = yield pool.request()
                    .input("user_id", sql.UniqueIdentifier, vehicle.user_id)
                    .input("tipo_vehiculo", sql.VarChar, vehicle.tipo_vehiculo)
                    .input("marca", sql.VarChar, vehicle.marca)
                    .input("modelo", sql.VarChar, vehicle.modelo)
                    .input("año", sql.Int, vehicle.anio)
                    .input("color", sql.VarChar, vehicle.color)
                    .input("placa", sql.VarChar, vehicle.placa)
                    .input("foto", sql.VarChar, vehicle.foto)
                    .input("modificaciones", sql.VarChar, vehicle.modificaciones)
                    .query(`
        INSERT INTO Vehicle (
          user_id, tipo_vehiculo, marca, modelo, año, color, placa, foto, modificaciones, created_at
        )
           VALUES (
          @user_id, @tipo_vehiculo, @marca, @modelo, @año, @color, @placa, @foto, @modificaciones, GETDATE()
        )
        
        
            SELECT TOP 1 * FROM Vehicle WHERE user_id = @user_id ORDER BY created_at DESC;
      `);
                return new modelVehicle_1.Vehicle(result.recordset[0]);
            }
            catch (error) {
                throw error;
            }
        });
    }
    getVehicle(id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const pool = yield connection_1.default.getConnection();
                const result = yield pool.request().query(`select * from Vehicle
               where id='${id}'`);
                console.log("sql result", result);
                if (!result.recordset[0])
                    throw new Error("no se encontro el Vehiculo o no existe");
                return new modelVehicle_1.Vehicle(result.recordset[0]);
            }
            catch (err) {
                throw err;
            }
        });
    }
    allVehicle(id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const pool = yield connection_1.default.getConnection();
                const result = yield pool.request().query(`select * from Vehicle
               where user_id='${id}' ORDER BY activo DESC`);
                if (!result.recordset[0])
                    throw new Error("no se encontro el Vehiculo o no existe");
                return result.recordset.map(v => new modelVehicle_1.Vehicle(v));
            }
            catch (err) {
                throw err;
            }
        });
    }
    deleteVehicle(id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const pool = yield connection_1.default.getConnection();
                yield pool.request().query(`DELETE FROM Vehicle WHERE id = '${id}';`);
            }
            catch (error) {
                throw error;
            }
        });
    }
    updateVehicle(vehicle) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            try {
                const pool = yield connection_1.default.getConnection();
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
                    throw new Error('No hay campos para actualizar');
                }
                const result = yield request.input("id", vehicle.id).query(`UPDATE Vehicle SET ${claveValor.join(',')} WHERE id = @id; SELECT * FROM Vehicle WHERE id = @id`);
                if (!((_a = result.recordset) === null || _a === void 0 ? void 0 : _a.length))
                    throw new Error("no se puedo actualizar el vehicle");
                return new modelVehicle_1.Vehicle(result.recordset[0]);
            }
            catch (error) {
                throw error;
            }
        });
    }
    activeVehicle(id, user_id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const pool = yield connection_1.default.getConnection();
                const request = pool.request();
                yield request.
                    input("id", id)
                    .input("user_id", user_id)
                    .query(`UPDATE Vehicle
                      SET activo = CASE 
                          WHEN id = @id THEN 1
                          ELSE 0
                      END
                      WHERE user_id =@user_id `);
            }
            catch (error) {
                throw error;
            }
        });
    }
    disableVehicle(id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const pool = yield connection_1.default.getConnection();
                const request = pool.request();
                yield request.
                    input("id", id)
                    .query(`UPDATE Vehicle
                      SET activo = 0
                      WHERE id =@id `);
            }
            catch (error) {
                throw error;
            }
        });
    }
}
exports.vehicleRepositorySql = vehicleRepositorySql;
//# sourceMappingURL=vehicleRepositorySql.js.map