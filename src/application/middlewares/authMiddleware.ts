import { Request, Response,NextFunction  } from "express";
import *as jwt from "jsonwebtoken";
import { MyPayload } from "../../types/userTypes";


export const authMiddleware =(req:Request,res:Response,next:NextFunction)=>{

      const authHeader = req.headers.authorization


      if(!authHeader){
        return  res.status(401).json({error:"no existe el token"})
      }

      
        if(!authHeader.startsWith("Bearer ")){
           return  res.status(401).json({ error: "formato no valido" });
  
        }

        const token = authHeader.split(" ")[1]


        try {
          
            
        const tokenValid = jwt.verify(token,process.env.JWT_SECRET!) as MyPayload

        req.user = tokenValid

        next()
            
        } catch (error) {
            return res.status(401).json({ error: "Invalid token" });
            
        }

}

