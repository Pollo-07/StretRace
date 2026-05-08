"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const challenge_controller_1 = __importDefault(require("../controllers/challenge-controller"));
const validationMiddleware_1 = require("../middlewares/validationMiddleware");
const challengeRoutes = (0, express_1.Router)();
const challengeConntroller = new challenge_controller_1.default();
challengeRoutes.get("/challenge", challengeConntroller.getchallenge);
challengeRoutes.get("/challengeAll", challengeConntroller.challengeAll);
challengeRoutes.post("/createChallenge", validationMiddleware_1.validateChallengeCreate, challengeConntroller.createchallenge);
challengeRoutes.delete("/deteleChallenge", validationMiddleware_1.validateIdBody, challengeConntroller.deletechallenge);
challengeRoutes.patch("/updateChallenge", challengeConntroller.updatechallenge);
challengeRoutes.patch("/acceptChallenge", validationMiddleware_1.validateChallengeActionWithNotification, challengeConntroller.acceptChallenge);
challengeRoutes.patch("/rejectChallenge", validationMiddleware_1.validateChallengeActionWithNotification, challengeConntroller.rejectChallenge);
challengeRoutes.patch("/cancelChallenge", validationMiddleware_1.validateIdBody, challengeConntroller.cancelChallenge);
// challengeRoutes.patch("/completeChallenge",challengeConntroller.completeChallenge)
challengeRoutes.patch("/reporteChallenge", validationMiddleware_1.validateChallengeReport, challengeConntroller.reporteChallenge);
challengeRoutes.patch("/startChallenge", validationMiddleware_1.validateIdBody, challengeConntroller.startChallenge);
//ADMIN
challengeRoutes.get("/ChallengeDisputed", challengeConntroller.ChallengeDisputed);
challengeRoutes.post("/resolveChallengeDisputed", validationMiddleware_1.validateResolveChallengeDisputed, challengeConntroller.resolveChallengeDisputed);
exports.default = challengeRoutes;
//# sourceMappingURL=challenge-routes.js.map