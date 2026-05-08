"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.notificationTipo = void 0;
exports.notificationTipo = {
    reto_recibido: (challange) => `${challange?.username} te ha retado a una carrera ${challange?.tipo_carrera} en ${challange?.ubicacion_acordada}`,
    reto_aceptado: (challange) => `${challange?.username} aceptó tu carrera ${challange?.tipo_carrera} en ${challange?.ubicacion_acordada} `,
    reto_rechazado: (challange) => `${challange?.username} rechazo tu carrera ${challange?.tipo_carrera} en ${challange?.ubicacion_acordada}`,
    resultado: (challange) => `resultado tu carrera ${challange?.tipo_carrera} en ${challange?.ubicacion_acordada} disponible`,
    rango_subido: () => `Subiste de rango 🚀`
};
//# sourceMappingURL=notificationTipo.js.map