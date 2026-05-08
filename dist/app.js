"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.io = exports.usersIo = void 0;
require("dotenv/config");
const express_1 = __importDefault(require("express"));
const app_router_1 = __importDefault(require("./application/routes/app-router"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const cors_1 = __importDefault(require("cors"));
const http_1 = __importDefault(require("http"));
const socket_io_1 = require("socket.io");
const PORT = process.env.PORT || 3000;
const App = (0, express_1.default)();
exports.usersIo = new Map();
const server = http_1.default.createServer(App);
exports.io = new socket_io_1.Server(server, {
    cors: {
        origin: "*"
    }
});
exports.io.on("connection", (socket) => {
    const userId = socket.handshake.query.userId;
    if (userId) {
        exports.usersIo.set(userId, socket.id);
    }
    socket.on("disconnect", () => {
        for (let [key, value] of exports.usersIo.entries()) {
            if (value === socket.id) {
                exports.usersIo.delete(key);
                break;
            }
        }
    });
});
App.use((0, cors_1.default)({
    origin: [
        "http://localhost:5173",
        "https://proud-water-023456e10.7.azurestaticapps.net"
    ],
    credentials: true
}));
App.use(express_1.default.json());
App.use((0, cookie_parser_1.default)());
App.use("/api", app_router_1.default);
App.get("/", (req, res) => {
    res.send("¡El servidor de StreetRace está vivo!");
});
server.listen(PORT, () => {
    console.log(`Servidor iniciado en el puerto: ${PORT}`);
});
//# sourceMappingURL=app.js.map