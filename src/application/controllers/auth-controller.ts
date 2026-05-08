import { Request, Response } from "express";
import { userMapper } from "../../domain/user/dto/userMapper";
import {  loginServices } from "../../domain/auth/service/loginServices";
import { userRepositorySql } from "../../infrastructure/adapters/userRepositorySql";


const userRepository = new userRepositorySql()

const loginService = new loginServices(userRepository)

export default class authController{
  
  login = async (req: Request, res: Response) => {
    const { password, email } = req.body;
 
    try {
     
      const {accessToken,refreshTokens,user } = await loginService.login(password,email)


     
    
      const dto = userMapper.toDto(user);

          res.cookie("refreshToken",refreshTokens ,{
            httpOnly:true,
            // secure:true,
               secure:false,
             sameSite:"lax",
            path: "/",
            maxAge: 7 * 24 * 60 * 60 * 1000
          })

      res.status(200).json({
        message: "login exitoso",
        accessToken,
        user: dto,
      });

    } catch (error) {
      if (error instanceof Error) {
        if (error.message.includes("Invalid credentials") || error.message.includes("no se encontro el usuario")) {
          return res.status(401).json({ error: "credenciales invalidas" });
        } 
    
      res.status(500).json({
        error: error.message,
      });
    }}
  };

  

logout = async (req: Request, res: Response) => {
        res.clearCookie("refreshToken", {
           httpOnly:true,
            secure:false,
            sameSite:"lax",
            path: "/",
            maxAge: 7 * 24 * 60 * 60 * 1000,
        });

  res.json({ message: "Logged out" });
};


 refreshTokens = async (req: Request, res: Response)=>{
    const old = req.cookies.refreshToken
if (!old) return res.sendStatus(401)
  
   try {
        const {newTokenAccess,newRefreshToken,id,role} =  await loginService.refreshTokens(old)


       
        res.cookie("refreshToken",newRefreshToken,{
              httpOnly: true,
              secure: false,
              sameSite: "lax",
              path: "/",
              maxAge: 7 * 24 * 60 * 60 * 1000

        })

        res.status(200).json({
            id:id,
            role:role,
           accessToken: newTokenAccess
        })
    
   } catch (error) {

    if (error instanceof Error) {
      if (error.message.includes("Invalid refresh token")) {
        return res.status(401).json({ error: "token de refresco invalido" });
      }
    res.status(500).send(error.message)
    
   }
  }
  }




}