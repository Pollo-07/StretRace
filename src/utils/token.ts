import * as jwt from "jsonwebtoken"

const generateToken =(userId:string ,userName:string,role:string )=>{

    const Token = jwt.sign({userId,userName,role},process.env.JWT_SECRET!,{expiresIn:"10m"})

    return Token
}


const refreshToken =(userId:string,role:string)=>{

    const refreshToken = jwt.sign({userId,role},process.env.JWT_REFRESH_SECRET!,{expiresIn:"7d"})

    return refreshToken
}


export default {
    generateToken,
    refreshToken
}