import { Request, Response } from "express";
import { challengeMapper } from "../../domain/challenge/dto/challengeMapper";
import challengeServices from "../../domain/challenge/services/challengeServices";
import { challengeAllMapper } from "../../domain/challenge/dto/challengeAllMapper";
import notificationServices from "../../domain/notification/services/notificationServices";
import challengeRepositorySql from "../../infrastructure/adapters/challengeRepositorySql";
import { userRepositorySql } from "../../infrastructure/adapters/userRepositorySql";
import notificationRepositorySql from "../../infrastructure/adapters/notificationRepositorySql";
import { vehicleRepositorySql } from "../../infrastructure/adapters/vehicleRepositorySql";

const challengeRepository = new challengeRepositorySql();
const userRepository = new userRepositorySql();
const vehicleRepository = new vehicleRepositorySql();
const notificacionRepository = new notificationRepositorySql()
const notificacionServicie = new notificationServices(notificacionRepository)


const challengeService = new challengeServices(
  challengeRepository,
  vehicleRepository,
  userRepository,
  notificacionServicie
);

export default class challengeController {

  createchallenge = async (req: Request, res: Response) => {
    const {challenge,notification} = req.body
    try {
      const responseChallenge = await challengeService.createchallenge(challenge,notification);
      const dto = challengeMapper.toDto(responseChallenge);

      res.status(201).json({
        ok: true,
        result: dto,
      });
    } catch (error) {
        if (error instanceof Error) { 
      if (error.message.includes("chk_no_self_challenge")) {
        return res.status(400).json({ error: "no se puede retar a si mismo" });
      }
      res.status(500).json({ error: error.message });
    }}
  };

  getchallenge = async (req: Request, res: Response) => {
    const  userId  = req.user?.userId as string;

    try {
      const result = await challengeService.getchallenge(userId);
      const dto = challengeMapper.toDto(result);

      res.status(200).json({ ok: true, result: dto });
    } catch (err) {
       if (err instanceof Error) {
      res.status(500).json({ error: err.message })
       }
    }
  };

   challengeAll = async (req: Request, res: Response) => {
    const  userId  = req.user?.userId as string;

    try {
      const result = await challengeService.challengeAll(userId);

    

       const newData = challengeAllMapper.toDtoList(result)


      res.status(200).json({ ok: true, result: newData });
    } catch (err) {
       if (err instanceof Error) {
      res.status(500).json({ error: err.message })
       }
    }
  };



  deletechallenge = async (req: Request, res: Response) => {
    const { id } = req.body;

    try {
       await challengeService.deletechallenge(id);
      res.status(200).json({ ok: true, message: "challenge eliminado exitosamente" });
    } catch (err) {
       if (err instanceof Error) {
      res.status(500).json({ error: err.message })
       }
    }
  };

  updatechallenge = async (req: Request, res: Response) => {
    try {
      const result = await challengeService.updatechallenge(req.body);
      res.status(200).json({ ok: true, result });
    } catch (err) {
        if (err instanceof Error) { 
      if (err.message.includes("chk_no_self_challenge")) {
        return res.status(400).json({ error: "no se puede retar a si mismo" });
      }
      res.status(500).json({ error: err.message });
    }
    }
  };

  
  acceptChallenge = async (req: Request, res: Response) => {
    const { id, id_retado ,notification} = req.body;

    try {
      await challengeService.acceptChallenge(id, id_retado,notification);
      res.status(200).json({ ok: true, message: "challenge aceptado exitosamente" });
    } catch (err) {
        if (err instanceof Error) {
      if (err.message.includes("chk_no_self_challenge")) {
        return res.status(400).json({ error: "no se puede retar a si mismo" });
      }
      res.status(500).json({ error: err.message });
    }
    }
  };

  rejectChallenge =async(req:Request,res:Response)=>{
        const {id,id_retado,notification} = req.body

        try{
         await challengeService.rejectChallenge(id,id_retado,notification)
         res.status(200).json({ok:true,message:"challenge rechazado exitosamente"})
        }catch(err){
            if(err instanceof Error){
           if(err.message.includes("chk_no_self_challenge")){
            return  res.status(400).json({ error:"no se puede retar a si mismo"});
          }
              res.status(500).json({ error: err.message });
        }
        }
    }

 startChallenge =async(req:Request,res:Response)=>{
        const {id} = req.body

        try{
         await challengeService.startChallenge(id)
         res.status(200).json({ok:true,message:"challenge iniciado exitosamente"})
        }catch(err){
            if(err instanceof Error){
              res.status(500).json({ error: err.message });
        }
        }
    }

  cancelChallenge =async(req:Request,res:Response)=>{
      const {id} = req.body
        try{
        await challengeService.cancelChallenge(id)
         res.status(200).json({ok:true,message:"challenge cancelado exitosamente"})
        }catch(err){
          if(err instanceof Error){
              res.status(500).json({ error: err.message });
        }
        }
    }

  //  completeChallenge = async (req: Request, res: Response) => {
  //   const { id, ganador_id } = req.body;

  //   try {
  //     const result = await challengeService.completeChallenge(id,ganador_id);

  //     res.status(201).json({ ok: "se ha completado el challenge", result });
  //   } catch (err) {
  //     if (err instanceof Error) {
  //         if(err.message.includes("CK__Challenge__estad__5535A963")){
  //            return res.status(400).json({
  //            error: "estado incorrecto",
  //       });
  //         }
  //     res.status(500).json({ error: err.message });
  //   }}
  // };



  incompleteChallenge = async (req: Request, res: Response) => {
    const { id } = req.body;

    try {
       await challengeService.incompleteChallenge(id);

      res.status(201).json({ ok: true,message:"se ha marcado el challenge como incompleto" });
    } catch (err) {
      if (err instanceof Error) {
      res.status(500).json({ error: err.message });
    }}
  };

  disputaChallenge = async (req: Request, res: Response) => {
    const { id } = req.body;

    try {
       await challengeService.disputateChallenge(id);
      res.status(201).json({ ok: true,message:"se ha actualizado el challenge" });
    } catch (err) {
      if (err instanceof Error) {
      res.status(500).json({ error: err.message });
    }}
  };

  
   reporteChallenge = async (req: Request, res: Response) => {
    const { id, id_ganador,notas,notification} = req.body;
    const userId = req.user?.userId


    try {
      await challengeService.reporteChallenge(id,id_ganador,userId!,notas,notification);

      res.status(201).json({ ok: true,message:"se ha registrado el reporte del challenge" });
    } catch (err) {
      if (err instanceof Error) {
      res.status(500).json({ error: err.message });
    }}
  };



// admin

  ChallengeDisputed = async (req: Request, res: Response) => {

    try {
     const result =   await challengeService.getChallengeDisputed();


      const newData = challengeAllMapper.toDtoList(result)

      res.status(200).json({
        result: newData,
      });
    } catch (error) {
      if (error instanceof Error) {
      res.status(500).json({
        error: error.message,
      });
    }}
  };
  

 resolveChallengeDisputed = async (req: Request, res: Response) => {
    const  {id,ganador_id} = req.body

    try {
       await challengeService.resolveChallengeDisputed(id,ganador_id);

      res.status(200).json({
        ok: true,
        message: "se ha resuelto el challenge con exito",
      });
    } catch (error) {
      if (error instanceof Error) {
      res.status(500).json({
        error: error.message,
      });
    }}
  };





}
