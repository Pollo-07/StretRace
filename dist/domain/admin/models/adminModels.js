"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const bcrypt_1 = __importDefault(require("bcrypt"));
class admin {
    constructor(data) {
        this.id = data.id;
        this.name = data.name;
        this.email = data.email;
        this.password_hash = data.password_hash;
        this.created_At = data.created_At;
        this.updated_At = data.updated_At;
    }
    getPassword() {
        return this.password_hash;
    }
    comparePassword(password) {
        return bcrypt_1.default.compare(password, this.password_hash);
    }
}
exports.default = admin;
//# sourceMappingURL=adminModels.js.map