"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const notificationServices_1 = __importDefault(require("../../domain/notification/services/notificationServices"));
const notificationRepositorySql_1 = __importDefault(require("../../infrastructure/adapters/notificationRepositorySql"));
const notificationRepository = new notificationRepositorySql_1.default();
const notificationService = new notificationServices_1.default(notificationRepository);
class notificationController {
    constructor() {
        this.getNotification = async (req, res) => {
            const userId = req.user?.userId;
            try {
                const result = await notificationService.getNotification(userId);
                res.status(200).json({ ok: true, result: result });
            }
            catch (err) {
                if (err instanceof Error) {
                    res.status(500).json({ ok: err.message });
                }
            }
        };
        this.deleteNotification = async (req, res) => {
            const { id } = req.body;
            try {
                await notificationService.deleteNotification(id);
                res
                    .status(200)
                    .json({ ok: true, result: "el usuario se elimino correctamente" });
            }
            catch (err) {
                if (err instanceof Error) {
                    res.status(500).json({ ok: err.message });
                }
            }
        };
        this.AllNotificationsAsRead = async (req, res) => {
            const userId = req.user?.userId;
            try {
                await notificationService.AllNotificationsAsRead(userId);
                res
                    .status(200)
                    .json({ ok: true, result: "se extrajo las Notificaciones correctamente" });
            }
            catch (err) {
                if (err instanceof Error) {
                    res.status(500).json({ ok: err.message });
                }
            }
        };
        // updateNotification = async (req: Request, res: Response) => {
        //   try {
        //     const result = await notificationService.updateNotification(
        //       req.body,
        //     );
        //     res.status(200).json({ ok: true, result });
        //   } catch (err) {
        //     if (err instanceof Error) {
        //     res.status(500).json({ ok: err.message });
        //   }}
        // };
    }
}
exports.default = notificationController;
//# sourceMappingURL=notification-controller.js.map