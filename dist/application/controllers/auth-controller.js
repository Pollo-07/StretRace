"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const userMapper_1 = require("../../domain/user/dto/userMapper");
const loginServices_1 = require("../../domain/auth/service/loginServices");
const userRepositorySql_1 = require("../../infrastructure/adapters/userRepositorySql");
const userRepository = new userRepositorySql_1.userRepositorySql();
const loginService = new loginServices_1.loginServices(userRepository);
class authController {
    constructor() {
        this.login = async (req, res) => {
            const { password, email } = req.body;
            try {
                const { accessToken, refreshTokens, user } = await loginService.login(password, email);
                const dto = userMapper_1.userMapper.toDto(user);
                res.cookie("refreshToken", refreshTokens, {
                    httpOnly: true,
                    // secure:true,
                    secure: false,
                    sameSite: "lax",
                    path: "/",
                    maxAge: 7 * 24 * 60 * 60 * 1000
                });
                res.status(200).json({
                    message: "login exitoso",
                    accessToken,
                    user: dto,
                });
            }
            catch (error) {
                if (error instanceof Error) {
                    if (error.message.includes("Invalid credentials") || error.message.includes("no se encontro el usuario")) {
                        return res.status(401).json({ error: "credenciales invalidas" });
                    }
                    res.status(500).json({
                        error: error.message,
                    });
                }
            }
        };
        this.logout = async (req, res) => {
            res.clearCookie("refreshToken", {
                httpOnly: true,
                secure: false,
                sameSite: "lax",
                path: "/",
                maxAge: 7 * 24 * 60 * 60 * 1000,
            });
            res.json({ message: "Logged out" });
        };
        this.refreshTokens = async (req, res) => {
            const old = req.cookies.refreshToken;
            if (!old)
                return res.sendStatus(401);
            try {
                const { newTokenAccess, newRefreshToken, id, role } = await loginService.refreshTokens(old);
                res.cookie("refreshToken", newRefreshToken, {
                    httpOnly: true,
                    secure: false,
                    sameSite: "lax",
                    path: "/",
                    maxAge: 7 * 24 * 60 * 60 * 1000
                });
                res.status(200).json({
                    id: id,
                    role: role,
                    accessToken: newTokenAccess
                });
            }
            catch (error) {
                if (error instanceof Error) {
                    if (error.message.includes("Invalid refresh token")) {
                        return res.status(401).json({ error: "token de refresco invalido" });
                    }
                    res.status(500).send(error.message);
                }
            }
        };
    }
}
exports.default = authController;
//# sourceMappingURL=auth-controller.js.map