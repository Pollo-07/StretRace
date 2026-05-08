"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateResolveChallengeDisputed = exports.validateChallengeReport = exports.validateChallengeActionWithNotification = exports.validateChallengeCreate = exports.validateUpdateCategory = exports.validateCreateCategory = exports.validateUpdateVehicle = exports.validateCreateVehicle = exports.validateAdminUpdateUser = exports.validateUserAllSearch = exports.validateRespectPilot = exports.validateIdBody = exports.validateIdParam = exports.validateRegister = exports.validateLogin = void 0;
const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
const notificationTypes = new Set([
    "reto_recibido",
    "reto_aceptado",
    "reto_rechazado",
    "resultado",
    "rango_subido",
]);
const challengeTypes = new Set(["cuarto_milla", "vueltas", "derrape"]);
const badRequest = (res, message) => res.status(400).json({ error: message });
const isNonEmptyString = (value) => typeof value === "string" && value.trim().length > 0;
const isUuid = (value) => isNonEmptyString(value) && uuidRegex.test(value);
const hasObject = (value) => typeof value === "object" && value !== null && !Array.isArray(value);
const isNotification = (value) => {
    if (!hasObject(value))
        return false;
    return (isUuid(value.user_id) &&
        isNonEmptyString(value.tipo) &&
        notificationTypes.has(value.tipo) &&
        typeof value.leida === "boolean");
};
const validateLogin = (req, res, next) => {
    const { email, password } = req.body ?? {};
    if (!isNonEmptyString(email) || !email.includes("@")) {
        return badRequest(res, "email invalido");
    }
    if (!isNonEmptyString(password) || password.length < 6) {
        return badRequest(res, "password invalido (minimo 6 caracteres)");
    }
    next();
};
exports.validateLogin = validateLogin;
const validateRegister = (req, res, next) => {
    const { username, email, password_hash, categoria_id, role } = req.body ?? {};
    if (!isNonEmptyString(username)) {
        return badRequest(res, "username es requerido");
    }
    if (!isNonEmptyString(email) || !email.includes("@")) {
        return badRequest(res, "email inválido");
    }
    if (!isNonEmptyString(password_hash) || password_hash.length < 6) {
        return badRequest(res, "password_hash inválido (mínimo 6 caracteres)");
    }
    if (!isUuid(categoria_id)) {
        return badRequest(res, "categoria_id inválido");
    }
    const allowedRoles = ["user", "admin"];
    if (!isNonEmptyString(role) || !allowedRoles.includes(role)) {
        return badRequest(res, "role inválido. Valores permitidos: user, admin");
    }
    next();
};
exports.validateRegister = validateRegister;
const validateIdParam = (param = "id") => {
    return (req, res, next) => {
        if (!isUuid(req.params?.[param])) {
            return badRequest(res, `${param} invalido`);
        }
        next();
    };
};
exports.validateIdParam = validateIdParam;
const validateIdBody = (req, res, next) => {
    if (!isUuid(req.body?.id))
        return badRequest(res, "id invalido");
    next();
};
exports.validateIdBody = validateIdBody;
const validateRespectPilot = (req, res, next) => {
    if (!isUuid(req.body?.respectUserId)) {
        return badRequest(res, "respectUserId invalido");
    }
    next();
};
exports.validateRespectPilot = validateRespectPilot;
const validateUserAllSearch = (req, res, next) => {
    const page = Number(req.query.page ?? 1);
    const limit = Number(req.query.limit ?? 10);
    if (!Number.isInteger(page) || page < 1)
        return badRequest(res, "page invalido");
    if (!Number.isInteger(limit) || limit < 1 || limit > 100) {
        return badRequest(res, "limit invalido (1-100)");
    }
    next();
};
exports.validateUserAllSearch = validateUserAllSearch;
const validateAdminUpdateUser = (req, res, next) => {
    const { id, data } = req.body ?? {};
    if (!isUuid(id))
        return badRequest(res, "id invalido");
    if (!hasObject(data) || Object.keys(data).length === 0) {
        return badRequest(res, "data es requerido");
    }
    next();
};
exports.validateAdminUpdateUser = validateAdminUpdateUser;
const validateCreateVehicle = (req, res, next) => {
    const { user_id, tipo_vehiculo, marca, modelo, anio, color, placa } = req.body ?? {};
    if (!isUuid(user_id))
        return badRequest(res, "user_id invalido");
    if (!isNonEmptyString(tipo_vehiculo))
        return badRequest(res, "tipo_vehiculo es requerido");
    if (!isNonEmptyString(marca))
        return badRequest(res, "marca es requerida");
    if (!isNonEmptyString(modelo))
        return badRequest(res, "modelo es requerido");
    if (!Number.isInteger(Number(anio)))
        return badRequest(res, "anio invalido");
    if (!isNonEmptyString(color))
        return badRequest(res, "color es requerido");
    if (!isNonEmptyString(placa))
        return badRequest(res, "placa es requerida");
    next();
};
exports.validateCreateVehicle = validateCreateVehicle;
const validateUpdateVehicle = (req, res, next) => {
    const { id, ...rest } = req.body ?? {};
    if (!id)
        return badRequest(res, "id es requerido");
    if (!isUuid(id))
        return badRequest(res, "id invalido");
    if (Object.keys(rest).length === 0) {
        return badRequest(res, "debe enviar al menos un campo para actualizar");
    }
    next();
};
exports.validateUpdateVehicle = validateUpdateVehicle;
const validateCreateCategory = (req, res, next) => {
    const { nombre, activo } = req.body ?? {};
    if (!isNonEmptyString(nombre))
        return badRequest(res, "nombre es requerido");
    if (typeof activo !== "boolean")
        return badRequest(res, "activo debe ser boolean");
    next();
};
exports.validateCreateCategory = validateCreateCategory;
const validateUpdateCategory = (req, res, next) => {
    const { id, ...rest } = req.body ?? {};
    if (!isUuid(id))
        return badRequest(res, "id invalido");
    if (Object.keys(rest).length === 0) {
        return badRequest(res, "debe enviar al menos un campo para actualizar");
    }
    next();
};
exports.validateUpdateCategory = validateUpdateCategory;
const validateChallengeCreate = (req, res, next) => {
    const { challenge, notification } = req.body ?? {};
    if (!hasObject(challenge))
        return badRequest(res, "challenge es requerido");
    if (!isNotification(notification))
        return badRequest(res, "notification invalida");
    const { retador_id, retado_id, tipo_carrera, vehiculo_retador_id, vehiculo_retado_id, ubicacion_acordada, fecha_acordada, } = challenge;
    if (!isUuid(retador_id) || !isUuid(retado_id)) {
        return badRequest(res, "retador_id o retado_id invalido");
    }
    if (!isNonEmptyString(tipo_carrera) || !challengeTypes.has(tipo_carrera)) {
        return badRequest(res, "tipo_carrera invalido");
    }
    if (!isUuid(vehiculo_retador_id) || !isUuid(vehiculo_retado_id)) {
        return badRequest(res, "vehiculo_retador_id o vehiculo_retado_id invalido");
    }
    if (!isNonEmptyString(ubicacion_acordada)) {
        return badRequest(res, "ubicacion_acordada es requerida");
    }
    if (!isNonEmptyString(fecha_acordada) || Number.isNaN(Date.parse(fecha_acordada))) {
        return badRequest(res, "fecha_acordada invalida");
    }
    next();
};
exports.validateChallengeCreate = validateChallengeCreate;
const validateChallengeActionWithNotification = (req, res, next) => {
    const { id, id_retado, notification } = req.body ?? {};
    if (!isUuid(id))
        return badRequest(res, "id invalido");
    if (!isUuid(id_retado))
        return badRequest(res, "id_retado invalido");
    if (!isNotification(notification))
        return badRequest(res, "notification invalida");
    next();
};
exports.validateChallengeActionWithNotification = validateChallengeActionWithNotification;
const validateChallengeReport = (req, res, next) => {
    const { id, id_ganador, notas, notification } = req.body ?? {};
    if (!isUuid(id))
        return badRequest(res, "id invalido");
    if (!isUuid(id_ganador))
        return badRequest(res, "id_ganador invalido");
    if (!isNonEmptyString(notas))
        return badRequest(res, "notas es requerido");
    if (!Array.isArray(notification) || notification.length === 0) {
        return badRequest(res, "notification debe ser un arreglo con al menos un elemento");
    }
    const invalid = notification.some((n) => !isNotification(n));
    if (invalid)
        return badRequest(res, "notification contiene elementos invalidos");
    next();
};
exports.validateChallengeReport = validateChallengeReport;
const validateResolveChallengeDisputed = (req, res, next) => {
    const { id, ganador_id } = req.body ?? {};
    if (!isUuid(id))
        return badRequest(res, "id invalido");
    if (!isUuid(ganador_id))
        return badRequest(res, "ganador_id invalido");
    next();
};
exports.validateResolveChallengeDisputed = validateResolveChallengeDisputed;
//# sourceMappingURL=validationMiddleware.js.map