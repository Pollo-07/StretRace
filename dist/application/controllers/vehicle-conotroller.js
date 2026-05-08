"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.vehicleControllers = void 0;
const vehicleMapper_1 = require("../../domain/vehicle/dto/vehicleMapper");
const vehicleServices_1 = __importDefault(require("../../domain/vehicle/services/vehicleServices"));
const vehicleRepositorySql_1 = require("../../infrastructure/adapters/vehicleRepositorySql");
const vehicleRpository = new vehicleRepositorySql_1.vehicleRepositorySql();
const vehicleService = new vehicleServices_1.default(vehicleRpository);
class vehicleControllers {
    constructor() {
        this.createVehicle = async (req, res) => {
            const file = req.file?.buffer;
            try {
                const result = await vehicleService.createVehicle(req.body, file);
                const dto = vehicleMapper_1.vehicleMapper.toDto(result);
                res.status(201).json({ ok: true, result: dto });
            }
            catch (err) {
                if (err instanceof Error) {
                    console.log("inicio del error", err);
                    if (err.message.includes(" máximo 3 vehículos")) {
                        return res.status(400).json({
                            error: "Un usuario solo puede tener máximo 3 vehículos",
                        });
                    }
                    res.status(500).json({ message: err.message });
                }
            }
        };
        this.getVehicle = async (req, res) => {
            const userId = req.user?.userId;
            try {
                const result = await vehicleService.getVehicle(userId);
                const dto = vehicleMapper_1.vehicleMapper.toDto(result);
                res.status(200).json({ ok: true, result: dto });
            }
            catch (err) {
                if (err instanceof Error) {
                    res.status(500).json({ error: err.message });
                }
            }
        };
        this.allVehicle = async (req, res) => {
            const userId = req.user?.userId;
            try {
                const result = await vehicleService.allVehicle(userId);
                const dto = vehicleMapper_1.vehicleMapper.toDtoList(result);
                res.status(200).json({ ok: true, result: dto });
            }
            catch (err) {
                if (err instanceof Error) {
                    res.status(500).json({ error: err.message });
                }
            }
        };
        this.deleteVehicle = async (req, res) => {
            const id = req.params.id;
            try {
                await vehicleService.deleteVehicle(id);
                res.status(200).json({ ok: true, message: "vehiculo eliminado" });
            }
            catch (err) {
                if (err instanceof Error) {
                    res.status(500).json({ error: err.message });
                }
            }
        };
        this.updateVehicle = async (req, res) => {
            try {
                const result = await vehicleService.updateVehicle(req.body);
                res.status(200).json({ ok: true, result });
            }
            catch (err) {
                if (err instanceof Error) {
                    if (err.message.includes("unico_vehiculo_activo")) {
                        return res.status(400).json({
                            error: "El usuario ya tiene un vehículo activo",
                        });
                    }
                    res.status(500).json({ error: err.message });
                }
            }
        };
        this.activeVehicle = async (req, res) => {
            const id = req.params.id;
            const userId = req.user?.userId;
            try {
                await vehicleService.activeVehicle(id, userId);
                res.status(200).json({ ok: true, });
            }
            catch (err) {
                if (err instanceof Error) {
                    if (err.message.includes("unico_vehiculo_activo")) {
                        return res.status(400).json({
                            error: "El usuario ya tiene un vehículo activo",
                        });
                    }
                    res.status(500).json({ error: err.message });
                }
            }
        };
    }
}
exports.vehicleControllers = vehicleControllers;
//# sourceMappingURL=vehicle-conotroller.js.map