import token from "../../../utils/token";
import { User } from "../../user/models/modelUser";
import { userRepository } from "../../user/ports/IUserRepository";
import *as jwt from "jsonwebtoken";
import { MyPayload } from "../../../types/userTypes";

export class loginServices {
    constructor(
        private userRepository:userRepository
    
    ){}

  async login (password:string,email:string):Promise<{
    accessToken:string,
    refreshTokens:string,
    user:User
   }>{

      const user = await this.userRepository.findByEmail(email);

       const {generateToken,refreshToken} = token 

        const valid = await user.comparePassword(password);

       if (!valid) throw new Error("contraseña incorrecta")

      const accessToken = generateToken(user.id,user.username,user.role)

      const refreshTokens =refreshToken(user.id,user.role)



        return{
            accessToken,
            refreshTokens,
            user
        }      

   }

     async refreshTokens(oldToken:string):Promise<{
id:string,
role:string
newTokenAccess:string,
newRefreshToken:string
  }>{

    const {generateToken,refreshToken} = token

    if(!oldToken) throw new Error("no hay token")

        try {
            const valid = jwt.verify(oldToken,process.env.JWT_REFRESH_SECRET!) as MyPayload
            
            const newTokenAccess= generateToken(valid.userId,valid.userName,valid.role)
            const newRefreshToken = refreshToken(valid.userId,valid.role)

            return{
                id: valid.userId,
                role:valid.role,
                newTokenAccess,
                newRefreshToken
            }
            
        } catch (error) {
            throw new Error("invalid token")
            
        }

    
}

}