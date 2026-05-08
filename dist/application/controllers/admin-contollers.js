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
const adminServices_1 = __importDefault(require("../../domain/admin/services/adminServices"));
const adminRepositorySql_1 = __importDefault(require("../../infrastructure/adminRepositorySql"));
const challengeRepositorySql_1 = __importDefault(require("../../infrastructure/challengeRepositorySql"));
const userRepositorySql_1 = require("../../infrastructure/userRepositorySql");
const userMapper_1 = require("../../domain/user/dto/userMapper");
const challengeMapper_1 = require("../../domain/challenge/dto/challengeMapper");
const userRepository = new userRepositorySql_1.userRepositorySql();
const challengeRepository = new challengeRepositorySql_1.default();
const adminRepositoy = new adminRepositorySql_1.default();
const adminService = new adminServices_1.default(userRepository, challengeRepository, adminRepositoy);
class adminControllers {
    constructor() {
        this.loginAdmin = (req, res) => __awaiter(this, void 0, void 0, function* () {
            const { email, password } = req.body;
            try {
                const { accesToken, admin, refreshTokens } = yield adminService.loginAdmin(email, password);
                res.cookie("refreshToken", refreshTokens, {
                    httpOnly: true,
                    // secure:true,
                    // sameSite:"strict",
                    secure: false,
                    sameSite: "lax",
                    path: "api/admin/",
                });
                res.status(200).json({
                    ok: "login existos",
                    user: admin,
                    token: accesToken,
                });
            }
            catch (error) {
                if (error instanceof Error) {
                    res.status(500).json({ error: error.message });
                }
            }
        });
        this.logout = (req, res) => __awaiter(this, void 0, void 0, function* () {
            res.clearCookie("refreshToken", {
                path: "api/admin/",
            });
            res.json({
                message: "logged out",
            });
        });
        this.UserAll = (req, res) => __awaiter(this, void 0, void 0, function* () {
            const { id } = req.body;
            try {
                const user = yield adminService.allUser();
                if (!user)
                    return res.status(404).send("el usuario no se encuentra registrado");
                const dto = userMapper_1.userMapper.toDto(user);
                res.status(200).json({
                    message: "usuario extraido",
                    result: dto,
                });
            }
            catch (error) {
                if (error instanceof Error) {
                    res.status(500).json({
                        error: error.message,
                    });
                }
            }
        });
        this.deleteUser = (req, res) => __awaiter(this, void 0, void 0, function* () {
            var _a, _b;
            const { id } = req.body;
            try {
                const deleteUser = yield adminService.deleteUser(id);
                if (((_b = (_a = deleteUser.rowsAffected) === null || _a === void 0 ? void 0 : _a[0]) !== null && _b !== void 0 ? _b : 0) === 0)
                    return res.status(404).send("el usuario no se encontro");
                res.status(200).json({
                    message: "usuario eliminado",
                    deleteUser,
                });
            }
            catch (error) {
                if (error instanceof Error) {
                    res.status(500).json({
                        error: error.message,
                    });
                }
            }
        });
        this.updateUser = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                const updateUser = yield adminService.updateUser(req.body);
                if (updateUser === null)
                    res.send("no se ha encontrado al usario");
                res.status(200).json({
                    message: "usuario actulizado",
                    updateUser,
                });
            }
            catch (error) {
                if (error instanceof Error) {
                    res.status(500).json({
                        error: error.message,
                    });
                }
            }
        });
        this.challengeAll = (req, res) => __awaiter(this, void 0, void 0, function* () {
            const { id } = req.body;
            try {
                const result = yield adminService.allChallenge();
                const dto = challengeMapper_1.chanllengeMapper.toDtoList(result);
                res.status(200).json({ ok: true, result: dto });
            }
            catch (err) {
                if (err instanceof Error) {
                    res.status(500).json({ error: err.message });
                }
            }
        });
        this.deletechallenge = (req, res) => __awaiter(this, void 0, void 0, function* () {
            var _a, _b;
            const { id } = req.body;
            try {
                const result = yield adminService.deletechallenge(id);
                if (((_b = (_a = result.rowsAffected) === null || _a === void 0 ? void 0 : _a[0]) !== null && _b !== void 0 ? _b : 0) === 0)
                    return res.status(404).send("el usuario no se encontro");
                res.status(200).json({ ok: true, result });
            }
            catch (err) {
                if (err instanceof Error) {
                    res.status(500).json({ error: err.message });
                }
            }
        });
        this.updatechallenge = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                const result = yield adminService.updatechallenge(req.body);
                res.status(201).json({ ok: true, result });
            }
            catch (err) {
                if (err instanceof Error) {
                    if (err.message.includes("chk_no_self_challenge")) {
                        return res.status(400).json({ error: "no se puede retar a si mismo" });
                    }
                    res.status(500).json({ error: err.message });
                }
            }
        });
        this.refreshTokens = (req, res) => __awaiter(this, void 0, void 0, function* () {
            const { old } = req.body;
            try {
                const { newRefreshToken, newTokenAcces } = yield adminService.refreshTokens(old);
                res.cookie("RefreshToken", newRefreshToken, {
                    httpOnly: true,
                    // secure:true,
                    // sameSite:"strict",
                    secure: false,
                    sameSite: "lax",
                    path: "api/admin/",
                });
                res.status(201).json({ ok: true, newTokenAcces });
            }
            catch (err) {
                if (err instanceof Error) {
                    res.status(500).json({ error: err.message });
                }
            }
        });
    }
}
exports.default = adminControllers;
//# sourceMappingURL=admin-contollers.js.map