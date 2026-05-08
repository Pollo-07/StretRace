import { Request, Response } from "express";
import { vehicleMapper } from "../../domain/vehicle/dto/vehicleMapper";
import vehicleServices from "../../domain/vehicle/services/vehicleServices";
import { vehicleRepositorySql } from "../../infrastructure/adapters/vehicleRepositorySql";


const vehicleRpository = new vehicleRepositorySql()
const vehicleService = new vehicleServices(vehicleRpository)


export class vehicleControllers {

  createVehicle = async (req: Request, res: Response) => {
      const file = req.file?.buffer
  
    try {
      const result = await vehicleService.createVehicle(req.body,file);

      const dto = vehicleMapper.toDto(result)
      res.status(201).json({ ok: true, result:dto});
    } catch (err) {
      if (err instanceof Error) {
        console.log("inicio del error",err)
      if (err.message.includes(" máximo 3 vehículos")) {
        return res.status(400).json({
          error: "Un usuario solo puede tener máximo 3 vehículos",
        });
      }

      res.status(500).json({ message: err.message });
    }}
  };

  getVehicle = async (req: Request, res: Response) => {
    const  userId  = req.user?.userId as string;

    try {
      const result = await vehicleService.getVehicle(userId);
        const dto = vehicleMapper.toDto(result)
      res.status(200).json({ ok: true, result:dto });
    } catch (err) {
      if (err instanceof Error) {
      res.status(500).json({ error: err.message });
    }}
  };

    allVehicle = async (req: Request, res: Response) => {
    const  userId  = req.user?.userId as string;

    try {
      const result = await vehicleService.allVehicle(userId);
        const dto = vehicleMapper.toDtoList(result)
      res.status(200).json({ ok: true, result:dto });
    } catch (err) {
      if (err instanceof Error) {
      res.status(500).json({ error: err.message });
    }}
  };

  deleteVehicle = async (req: Request, res: Response) => {
    const  id  = req.params.id as string;

    try {
        await vehicleService.deleteVehicle(id);
      

      res.status(200).json({ ok: true, message:"vehiculo eliminado" });
    } catch (err) {
      if (err instanceof Error) {
      res.status(500).json({ error: err.message });
    }}
  };

  updateVehicle = async (req: Request, res: Response) => {
    try {
      const result = await vehicleService.updateVehicle(req.body);

      res.status(200).json({ ok: true, result });
    } catch (err) {
      if (err instanceof Error) {
      if (err.message.includes("unico_vehiculo_activo")) {
        return res.status(400).json({
          error: "El usuario ya tiene un vehículo activo",
        });
      }

      res.status(500).json({ error: err.message });
    }}
  };

    activeVehicle = async (req: Request, res: Response) => {  

       const  id  = req.params.id as string;
      const userId = req.user?.userId!

        try {   
          await vehicleService.activeVehicle(id,userId);
          res.status(200).json({ ok: true,});   
      } catch (err) {
          if (err instanceof Error) {
                if (err.message.includes("unico_vehiculo_activo")) {
                  return res.status(400).json({
                    error: "El usuario ya tiene un vehículo activo",
                  })}
        res.status(500).json({ error: err.message });
      }}}

  
      


}
