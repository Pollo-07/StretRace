import {Router} from "express"
import challengeController from "../controllers/challenge-controller"
import {
  validateChallengeActionWithNotification,
  validateChallengeCreate,
  validateChallengeReport,
  validateIdBody,
  validateResolveChallengeDisputed,
} from "../middlewares/validationMiddleware";

const challengeRoutes:Router = Router()

const challengeConntroller = new challengeController()

challengeRoutes.get("/challenge",challengeConntroller.getchallenge)
challengeRoutes.get("/challengeAll",challengeConntroller.challengeAll)

challengeRoutes.post("/createChallenge",validateChallengeCreate,challengeConntroller.createchallenge)
challengeRoutes.delete("/deteleChallenge",validateIdBody,challengeConntroller.deletechallenge)

challengeRoutes.patch("/updateChallenge",challengeConntroller.updatechallenge)

challengeRoutes.patch("/acceptChallenge",validateChallengeActionWithNotification,challengeConntroller.acceptChallenge)
challengeRoutes.patch("/rejectChallenge",validateChallengeActionWithNotification,challengeConntroller.rejectChallenge)
challengeRoutes.patch("/cancelChallenge",validateIdBody,challengeConntroller.cancelChallenge)
// challengeRoutes.patch("/completeChallenge",challengeConntroller.completeChallenge)


challengeRoutes.patch("/reporteChallenge",validateChallengeReport,challengeConntroller.reporteChallenge)
challengeRoutes.patch("/startChallenge",validateIdBody,challengeConntroller.startChallenge)


//ADMIN
 challengeRoutes.get("/ChallengeDisputed",challengeConntroller.ChallengeDisputed)
 challengeRoutes.post("/resolveChallengeDisputed",validateResolveChallengeDisputed,challengeConntroller.resolveChallengeDisputed)

export default challengeRoutes
