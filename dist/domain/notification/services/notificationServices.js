"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const app_1 = require("../../../app");
const notificationTipo_1 = require("../../../utils/notificationTipo");
class notificationServices {
    constructor(notificationRepository) {
        this.notificationRepository = notificationRepository;
    }
    async createNotification(notification, challenge) {
        const socketId = app_1.usersIo.get(notification.user_id);
        const notificacionIo = {
            tipo: notification.tipo,
            mesagge: notificationTipo_1.notificationTipo[notification.tipo]?.(challenge) ?? "Tienes una nueva notificación",
            fecha: new Date()
        };
        if (socketId) {
            app_1.io.to(socketId).emit("notificacion", notificacionIo);
        }
        return await this.notificationRepository.createNotification({ ...notification, mensaje: notificacionIo.mesagge });
    }
    async getNotification(userId) {
        return await this.notificationRepository.getNotification(userId);
    }
    async deleteNotification(id) {
        return await this.notificationRepository.deleteNotification(id);
    }
    async AllNotificationsAsRead(userId) {
        return await this.notificationRepository.AllNotificationsAsRead(userId);
    }
}
exports.default = notificationServices;
//# sourceMappingURL=notificationServices.js.map