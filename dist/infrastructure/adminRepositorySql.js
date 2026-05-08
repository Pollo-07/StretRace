"use strict";
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
const adminModels_1 = __importDefault(require("../domain/admin/models/adminModels"));
const connection_1 = require("./database/connection");
class adminRepositorySql {
    findByEmail(email) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const pool = yield (0, connection_1.getConnection)();
                const result = yield pool.request().query(`select * from Admins where email = ${email}`);
                if (!result.recordset[0])
                    throw new Error("no se encontro la competitonCategory");
                return new adminModels_1.default(result.recordset[0]);
            }
            catch (error) {
                throw error;
            }
        });
    }
}
exports.default = adminRepositorySql;
//# sourceMappingURL=adminRepositorySql.js.map