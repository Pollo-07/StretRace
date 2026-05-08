"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.dbConfigAzure = exports.dbConfig = void 0;
exports.dbConfig = {
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    server: process.env.DB_HOST,
    database: process.env.DB_NAME,
    options: {
        encrypt: false,
        trustServerCertificate: true,
    },
};
exports.dbConfigAzure = {
    user: process.env.DB_USER_AZURE,
    password: process.env.DB_PASSWORD_AZURE,
    server: process.env.DB_HOST_AZURE,
    port: Number(process.env.DB_PORT_AZURE),
    database: process.env.DB_NAME_AZURE,
    options: {
        encrypt: true,
        trustServerCertificate: false,
    }
};
//# sourceMappingURL=database.js.map