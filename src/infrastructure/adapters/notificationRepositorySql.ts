
import * as sql from "mssql";
import Database from "../database/connection";
import UserNotification from "../../domain/notification/models/modelNotification";
import notificationRepository from "../../domain/notification/ports/INotificationRepository";
export default class notificationRepositorySql implements notificationRepository {

  async createNotification(notification: UserNotification): Promise<UserNotification> {
     const pool = await Database.getConnection()


    try {
      const result = await pool
        .request()
        .input("user_id", sql.UniqueIdentifier, notification.user_id)
        .input("tipo", sql.VarChar, notification.tipo)
        .input("mensaje", sql.VarChar, notification.mensaje)
        .input("leida", sql.Bit, notification.leida)
        .input("referencia_id", sql.UniqueIdentifier, notification.referencia_id)
        .query(`
            INSERT INTO Notification (
              user_id,
              tipo,
              mensaje,
              leida,
              referencia_id,
              created_at
            )
              OUTPUT INSERTED.*
            VALUES (
              @user_id,
              @tipo,
              @mensaje,
              @leida,
              @referencia_id,
              GETDATE()
            )


  `);
      return new UserNotification(result.recordset[0]);
    } catch (error) {
      throw error;
    }
  }

  async getNotification(userId: string): Promise<UserNotification[]> {
    try {
       const pool = await Database.getConnection()


      const result = await pool.request()
      .input("userId", sql.UniqueIdentifier, userId)
      .query(`select * from Notification
               where user_id=@userId
               ORDER BY created_at DESC
               `);
               
        if(!result.recordset?.length) throw new Error("no  se encontro la notiificacion o no existe")


      return result.recordset;
    } catch (err) {
      throw err;
    }
  }

  async deleteNotification(id: string): Promise<void> {
    try {
        const pool = await Database.getConnection()
       await pool
        .request()
        .query(`DELETE FROM Notification WHERE id = '${id}';`);

      
    } catch (error) {
      throw error;
    }
  }

   async AllNotificationsAsRead(userId: string): Promise<void> {
    try {
        const pool = await Database.getConnection()
       await pool
        .request()
        .input("userId", sql.UniqueIdentifier, userId)
        .query(`UPDATE Notification SET leida = 1 where user_id =@userId`);

      
    } catch (error) {
      throw error;
    }
  }
}
