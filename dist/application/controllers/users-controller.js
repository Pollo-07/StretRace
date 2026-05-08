"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.userControllers = void 0;
const userMapper_1 = require("../../domain/user/dto/userMapper");
const userServices_1 = __importDefault(require("../../domain/user/services/userServices"));
const modelUser_1 = require("../../domain/user/models/modelUser");
const userRepositorySql_1 = require("../../infrastructure/adapters/userRepositorySql");
const userRepository = new userRepositorySql_1.userRepositorySql();
const userService = new userServices_1.default(userRepository);
class userControllers {
    constructor() {
        this.RegisterUsers = async (req, res) => {
            const data = req.body;
            const user = new modelUser_1.User(data);
            try {
                const result = await userService.createUser(user);
                const dto = userMapper_1.userMapper.toDto(result);
                res.status(201).json({
                    ok: true,
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
        };
        this.getUser = async (req, res) => {
            const userId = req.user?.userId;
            try {
                const user = await userService.getUser(userId);
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
        };
        this.deleteUser = async (req, res) => {
            const { id } = req.params;
            try {
                await userService.deleteUser(id);
                res.status(200).json({
                    message: "usuario eliminado",
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
        this.updateMe = async (req, res) => {
            const userID = req.user?.userId;
            const file = req.file?.buffer;
            try {
                const updateUser = await userService.updateUser(req.body, userID, file);
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
        };
        this.updateUser = async (req, res) => {
            const { data, id } = req.body;
            const file = req.file?.buffer;
            try {
                const updateUser = await userService.updateUser(data, id, file);
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
        };
        this.discoverPilot = async (req, res) => {
            const userId = req.user?.userId;
            try {
                const userDiscover = await userService.discoverPilot(userId);
                if (!userDiscover)
                    return res.status(404).send("no hay Pilotos en tu zona");
                res.status(200).json({
                    result: userDiscover,
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
        this.respectPilot = async (req, res) => {
            const userId = req.user?.userId;
            const { respectUserId } = req.body;
            try {
                await userService.respectPilot(userId, respectUserId);
                res.status(200).json({
                    result: "respect",
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
        this.getRespectPilot = async (req, res) => {
            const userId = req.user?.userId;
            try {
                const result = await userService.getrespectPilot(userId);
                res.status(200).json({
                    result: result,
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
        //admin
        this.UserAll = async (req, res) => {
            try {
                const result = await userService.getUserAll();
                const resultMapper = userMapper_1.userMapper.toDtoList(result);
                res.status(200).json({
                    result: resultMapper,
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
        this.UserAllSearch = async (req, res) => {
            const page = Number(req.query.page) || 1;
            const limit = Number(req.query.limit) || 10;
            const search = req.query.search?.toString() || "";
            const offset = (page - 1) * limit;
            try {
                const result = await userService.getUserAllSearch(search, offset, limit);
                res.status(200).json({
                    result: result,
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
exports.userControllers = userControllers;
//# sourceMappingURL=users-controller.js.map