
import { Request, Response } from "express";
import notificationRepository from "../../domain/notification/ports/INotificationRepository";
import notificationServices from "../../domain/notification/services/notificationServices";
import notificationRepositorySql from "../../infrastructure/adapters/notificationRepositorySql";



const notificationRepository =  new notificationRepositorySql()
const notificationService = new notificationServices(notificationRepository)

export default class notificationController {
 

  getNotification = async (req: Request, res: Response) => {
    const  userId  = req.user?.userId as string

    try {
      const result = await notificationService.getNotification(userId);
      res.status(200).json({ ok: true, result: result });
    } catch (err) {
      if (err instanceof Error) {
      res.status(500).json({ ok: err.message });
    }}
  };

  deleteNotification = async (req: Request, res: Response) => {
    const { id } = req.body;

    try {
       await notificationService.deleteNotification(id)

      res
        .status(200)
        .json({ ok: true, result: "el usuario se elimino correctamente" });
    } catch (err) {
      if (err instanceof Error) {
      res.status(500).json({ ok: err.message });
    }}
  };

    AllNotificationsAsRead = async (req: Request, res: Response) => {
    const userId = req.user?.userId as string;

    try {
       await notificationService.AllNotificationsAsRead(userId)

      res
        .status(200)
        .json({ ok: true, result: "se extrajo las Notificaciones correctamente" });
    } catch (err) {
      if (err instanceof Error) {
      res.status(500).json({ ok: err.message });
    }}
  };




  // updateNotification = async (req: Request, res: Response) => {
  //   try {
  //     const result = await notificationService.updateNotification(
  //       req.body,
  //     );

  //     res.status(200).json({ ok: true, result });
  //   } catch (err) {
  //     if (err instanceof Error) {
  //     res.status(500).json({ ok: err.message });
  //   }}
  // };
}
