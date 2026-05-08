"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const challengeMapper_1 = require("../../domain/challenge/dto/challengeMapper");
const challengeServices_1 = __importDefault(require("../../domain/challenge/services/challengeServices"));
const challengeAllMapper_1 = require("../../domain/challenge/dto/challengeAllMapper");
const notificationServices_1 = __importDefault(require("../../domain/notification/services/notificationServices"));
const challengeRepositorySql_1 = __importDefault(require("../../infrastructure/adapters/challengeRepositorySql"));
const userRepositorySql_1 = require("../../infrastructure/adapters/userRepositorySql");
const notificationRepositorySql_1 = __importDefault(require("../../infrastructure/adapters/notificationRepositorySql"));
const vehicleRepositorySql_1 = require("../../infrastructure/adapters/vehicleRepositorySql");
const challengeRepository = new challengeRepositorySql_1.default();
const userRepository = new userRepositorySql_1.userRepositorySql();
const vehicleRepository = new vehicleRepositorySql_1.vehicleRepositorySql();
const notificacionRepository = new notificationRepositorySql_1.default();
const notificacionServicie = new notificationServices_1.default(notificacionRepository);
const challengeService = new challengeServices_1.default(challengeRepository, vehicleRepository, userRepository, notificacionServicie);
class challengeController {
    constructor() {
        this.createchallenge = async (req, res) => {
            const { challenge, notification } = req.body;
            try {
                const responseChallenge = await challengeService.createchallenge(challenge, notification);
                const dto = challengeMapper_1.challengeMapper.toDto(responseChallenge);
                res.status(201).json({
                    ok: true,
                    result: dto,
                });
            }
            catch (error) {
                if (error instanceof Error) {
                    if (error.message.includes("chk_no_self_challenge")) {
                        return res.status(400).json({ error: "no se puede retar a si mismo" });
                    }
                    res.status(500).json({ error: error.message });
                }
            }
        };
        this.getchallenge = async (req, res) => {
            const userId = req.user?.userId;
            try {
                const result = await challengeService.getchallenge(userId);
                const dto = challengeMapper_1.challengeMapper.toDto(result);
                res.status(200).json({ ok: true, result: dto });
            }
            catch (err) {
                if (err instanceof Error) {
                    res.status(500).json({ error: err.message });
                }
            }
        };
        this.challengeAll = async (req, res) => {
            const userId = req.user?.userId;
            try {
                const result = await challengeService.challengeAll(userId);
                const newData = challengeAllMapper_1.challengeAllMapper.toDtoList(result);
                res.status(200).json({ ok: true, result: newData });
            }
            catch (err) {
                if (err instanceof Error) {
                    res.status(500).json({ error: err.message });
                }
            }
        };
        this.deletechallenge = async (req, res) => {
            const { id } = req.body;
            try {
                await challengeService.deletechallenge(id);
                res.status(200).json({ ok: true, message: "challenge eliminado exitosamente" });
            }
            catch (err) {
                if (err instanceof Error) {
                    res.status(500).json({ error: err.message });
                }
            }
        };
        this.updatechallenge = async (req, res) => {
            try {
                const result = await challengeService.updatechallenge(req.body);
                res.status(200).json({ ok: true, result });
            }
            catch (err) {
                if (err instanceof Error) {
                    if (err.message.includes("chk_no_self_challenge")) {
                        return res.status(400).json({ error: "no se puede retar a si mismo" });
                    }
                    res.status(500).json({ error: err.message });
                }
            }
        };
        this.acceptChallenge = async (req, res) => {
            const { id, id_retado, notification } = req.body;
            try {
                await challengeService.acceptChallenge(id, id_retado, notification);
                res.status(200).json({ ok: true, message: "challenge aceptado exitosamente" });
            }
            catch (err) {
                if (err instanceof Error) {
                    if (err.message.includes("chk_no_self_challenge")) {
                        return res.status(400).json({ error: "no se puede retar a si mismo" });
                    }
                    res.status(500).json({ error: err.message });
                }
            }
        };
        this.rejectChallenge = async (req, res) => {
            const { id, id_retado, notification } = req.body;
            try {
                await challengeService.rejectChallenge(id, id_retado, notification);
                res.status(200).json({ ok: true, message: "challenge rechazado exitosamente" });
            }
            catch (err) {
                if (err instanceof Error) {
                    if (err.message.includes("chk_no_self_challenge")) {
                        return res.status(400).json({ error: "no se puede retar a si mismo" });
                    }
                    res.status(500).json({ error: err.message });
                }
            }
        };
        this.startChallenge = async (req, res) => {
            const { id } = req.body;
            try {
                await challengeService.startChallenge(id);
                res.status(200).json({ ok: true, message: "challenge iniciado exitosamente" });
            }
            catch (err) {
                if (err instanceof Error) {
                    res.status(500).json({ error: err.message });
                }
            }
        };
        this.cancelChallenge = async (req, res) => {
            const { id } = req.body;
            try {
                await challengeService.cancelChallenge(id);
                res.status(200).json({ ok: true, message: "challenge cancelado exitosamente" });
            }
            catch (err) {
                if (err instanceof Error) {
                    res.status(500).json({ error: err.message });
                }
            }
        };
        //  completeChallenge = async (req: Request, res: Response) => {
        //   const { id, ganador_id } = req.body;
        //   try {
        //     const result = await challengeService.completeChallenge(id,ganador_id);
        //     res.status(201).json({ ok: "se ha completado el challenge", result });
        //   } catch (err) {
        //     if (err instanceof Error) {
        //         if(err.message.includes("CK__Challenge__estad__5535A963")){
        //            return res.status(400).json({
        //            error: "estado incorrecto",
        //       });
        //         }
        //     res.status(500).json({ error: err.message });
        //   }}
        // };
        this.incompleteChallenge = async (req, res) => {
            const { id } = req.body;
            try {
                await challengeService.incompleteChallenge(id);
                res.status(201).json({ ok: true, message: "se ha marcado el challenge como incompleto" });
            }
            catch (err) {
                if (err instanceof Error) {
                    res.status(500).json({ error: err.message });
                }
            }
        };
        this.disputaChallenge = async (req, res) => {
            const { id } = req.body;
            try {
                await challengeService.disputateChallenge(id);
                res.status(201).json({ ok: true, message: "se ha actualizado el challenge" });
            }
            catch (err) {
                if (err instanceof Error) {
                    res.status(500).json({ error: err.message });
                }
            }
        };
        this.reporteChallenge = async (req, res) => {
            const { id, id_ganador, notas, notification } = req.body;
            const userId = req.user?.userId;
            try {
                await challengeService.reporteChallenge(id, id_ganador, userId, notas, notification);
                res.status(201).json({ ok: true, message: "se ha registrado el reporte del challenge" });
            }
            catch (err) {
                if (err instanceof Error) {
                    res.status(500).json({ error: err.message });
                }
            }
        };
        // admin
        this.ChallengeDisputed = async (req, res) => {
            try {
                const result = await challengeService.getChallengeDisputed();
                const newData = challengeAllMapper_1.challengeAllMapper.toDtoList(result);
                res.status(200).json({
                    result: newData,
                });
            }
            catch (error) {
                if (error instanceof Error) {
                    res.status(500).json({
                        error: error.message,
                    });
                }
            }
        };
        this.resolveChallengeDisputed = async (req, res) => {
            const { id, ganador_id } = req.body;
            try {
                await challengeService.resolveChallengeDisputed(id, ganador_id);
                res.status(200).json({
                    ok: true,
                    message: "se ha resuelto el challenge con exito",
                });
            }
            catch (error) {
                if (error instanceof Error) {
                    res.status(500).json({
                        error: error.message,
                    });
                }
            }
        };
    }
}
exports.default = challengeController;
//# sourceMappingURL=challenge-controller.js.map