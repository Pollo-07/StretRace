"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.NotificationMapper = void 0;
class NotificationMapper {
    static toDto(notification) {
        return {
            id: notification.id,
            user_id: notification.user_id,
            tipo: notification.tipo,
            mensaje: notification.mensaje,
            leida: notification.leida,
            referencia_id: notification.referencia_id,
            created_at: notification.created_at
        };
    }
}
exports.NotificationMapper = NotificationMapper;
//# sourceMappingURL=notificationMapper.js.map