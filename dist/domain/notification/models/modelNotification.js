"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class UserNotification {
    constructor(data) {
        this.id = data.id;
        this.user_id = data.user_id;
        this.tipo = data.tipo;
        this.mensaje = data.mensaje;
        this.leida = data.leida;
        this.referencia_id = data.referencia_id;
        this.created_at = data.created_at;
    }
}
exports.default = UserNotification;
//# sourceMappingURL=modelNotification.js.map