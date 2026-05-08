"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.loginServices = void 0;
const token_1 = __importDefault(require("../../../utils/token"));
const jwt = __importStar(require("jsonwebtoken"));
class loginServices {
    constructor(userRepository) {
        this.userRepository = userRepository;
    }
    async login(password, email) {
        const user = await this.userRepository.findByEmail(email);
        const { generateToken, refreshToken } = token_1.default;
        const valid = await user.comparePassword(password);
        if (!valid)
            throw new Error("contraseña incorrecta");
        const accessToken = generateToken(user.id, user.username, user.role);
        const refreshTokens = refreshToken(user.id, user.role);
        return {
            accessToken,
            refreshTokens,
            user
        };
    }
    async refreshTokens(oldToken) {
        const { generateToken, refreshToken } = token_1.default;
        if (!oldToken)
            throw new Error("no hay token");
        try {
            const valid = jwt.verify(oldToken, process.env.JWT_REFRESH_SECRET);
            const newTokenAccess = generateToken(valid.userId, valid.userName, valid.role);
            const newRefreshToken = refreshToken(valid.userId, valid.role);
            return {
                id: valid.userId,
                role: valid.role,
                newTokenAccess,
                newRefreshToken
            };
        }
        catch (error) {
            throw new Error("invalid token");
        }
    }
}
exports.loginServices = loginServices;
//# sourceMappingURL=loginServices.js.map