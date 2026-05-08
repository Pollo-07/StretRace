"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.User = void 0;
const bcryptjs_1 = __importDefault(require("bcryptjs"));
class User {
    constructor(data) {
        this.id = data.id;
        this.username = data.username;
        this.email = data.email;
        this.password_hash = data.password_hash;
        this.foto_perfil = data.foto_perfil;
        this.zona_localidad = data.zona_localidad;
        this.zona_ciudad = data.zona_ciudad;
        this.zona_estado = data.zona_estado;
        this.zona_pais = data.zona_pais;
        this.rango = data.rango;
        this.categoria_id = data.categoria_id;
        this.victorias = data.victorias;
        this.derrotas = data.derrotas;
        this.retos_consecutivos = data.retos_consecutivos;
        this.estado = data.estado;
        this.role = data.role;
        this.created_at = data.created_at;
        this.updated_at = data.updated_at;
        this.CompetitionCategory = data.CompetitionCategory;
    }
    comparePassword(password) {
        return bcryptjs_1.default.compare(password, this.password_hash);
    }
    getPasswordHash() {
        return bcryptjs_1.default.hashSync(this.password_hash, 10);
    }
}
exports.User = User;
//# sourceMappingURL=modelUser.js.map