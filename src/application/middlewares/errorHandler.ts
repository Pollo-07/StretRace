import { ErrorRequestHandler,Request, Response, NextFunction  } from "express";


export const  errorHandler:ErrorRequestHandler =(err,req:Request,res:Response,next:NextFunction)=>{
    const status = err.status || 500
    const message = err.message || "internal server error"

    res.status(status).json({message})

}