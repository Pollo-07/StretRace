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
const token_1 = __importDefault(require("../../../utils/token"));
const jwt = __importStar(require("jsonwebtoken"));
class adminServices {
    constructor(userRepository, challengeRepository, adminRepositoy) {
        this.userRepository = userRepository;
        this.challengeRepository = challengeRepository;
        this.adminRepositoy = adminRepositoy;
    }
    loginAdmin(email, password) {
        return __awaiter(this, void 0, void 0, function* () {
            const admin = yield this.adminRepositoy.findByEmail(email);
            const { generateToken, refreshToken } = token_1.default;
            const valid = admin.comparePassword(password);
            if (!valid)
                throw new Error("contraseñas incorrectas");
            const accesToken = generateToken(admin.id, admin.name);
            const refreshTokens = refreshToken(admin.id);
            return {
                accesToken,
                refreshTokens,
                admin,
            };
        });
    }
    allUser() {
        return __awaiter(this, void 0, void 0, function* () {
            const users = yield this.userRepository.getUserAll();
            return users;
        });
    }
    deleteUser(id) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.userRepository.deleteUser(id);
        });
    }
    updateUser(user) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.userRepository.updateUser(user);
        });
    }
    allChallenge() {
        return __awaiter(this, void 0, void 0, function* () {
            const users = yield this.challengeRepository.ChallengeAll();
            return users;
        });
    }
    updatechallenge(challenge) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.challengeRepository.updatechallenge(challenge);
        });
    }
    deletechallenge(id) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.challengeRepository.deletechallenge(id);
        });
    }
    refreshTokens(oldToken) {
        return __awaiter(this, void 0, void 0, function* () {
            const { generateToken, refreshToken } = token_1.default;
            if (!oldToken)
                throw new Error("no hay token");
            try {
                const valid = jwt.verify(oldToken, process.env.JWT_REFRESH_SECRET);
                const newTokenAcces = generateToken(valid.userId, valid.userName);
                const newRefreshToken = refreshToken(valid.userId);
                return {
                    newTokenAcces,
                    newRefreshToken,
                };
            }
            catch (error) {
                throw new Error("invalid token");
            }
        });
    }
}
exports.default = adminServices;
//# sourceMappingURL=adminServices.js.map