import { Request, Response } from "express";
import { userMapper } from "../../domain/user/dto/userMapper";
import userServices from "../../domain/user/services/userServices";
import { User } from "../../domain/user/models/modelUser";
import { userRepositorySql } from "../../infrastructure/adapters/userRepositorySql";



const  userRepository = new userRepositorySql()
  const userService = new userServices(userRepository)

export class userControllers {


  RegisterUsers = async (req: Request, res: Response) => {
    const data = req.body;
    const user = new User(data)

    try {
      const result = await userService.createUser(user);
      const dto = userMapper.toDto(result);

      res.status(201).json({
        ok: true,
        result: dto,
      });
    } catch (error) {
      if (error instanceof Error) {
      res.status(500).json({
        error: error.message,
      });
    }}
  };



  getUser = async (req: Request, res: Response) => {
    const  userId  = req.user?.userId as string;
    try {
      const user = await userService.getUser(userId);

      if (!user)
        return res.status(404).send("el usuario no se encuentra registrado");

      const dto = userMapper.toDto(user);

      res.status(200).json({
        message: "usuario extraido",
        result: dto,
      });
    } catch (error) {
      if (error instanceof Error) {
      res.status(500).json({
        error: error.message,
      });
    }}
  };


  deleteUser = async (req: Request, res: Response) => {
    const { id } = req.params;


    try {
      await userService.deleteUser(id);
      res.status(200).json({
        message: "usuario eliminado",
            });
    } catch (error) {
      if (error instanceof Error) {
      res.status(500).json({
        error: error.message,
      });
    }}
  };

  updateMe = async (req: Request, res: Response) => {
    const userID = req.user?.userId!
    const file = req.file?.buffer!
    try {
      const updateUser = await userService.updateUser(req.body,userID,file);
     

      if (updateUser === null) res.send("no se ha encontrado al usario");

      res.status(200).json({
        message: "usuario actulizado",
        updateUser,
      });
    } catch (error) {
      if (error instanceof Error) {
      res.status(500).json({
        error: error.message,
      });
    }}
  };

    updateUser = async (req: Request, res: Response) => {
    const {data,id} = req.body
    const file = req.file?.buffer!
    
    try {
      const updateUser = await userService.updateUser(data,id,file);
     

      if (updateUser === null) res.send("no se ha encontrado al usario");

      res.status(200).json({
        message: "usuario actulizado",
        updateUser,
      });
    } catch (error) {
      if (error instanceof Error) {
      res.status(500).json({
        error: error.message,
      });
    }}
  };
  

   discoverPilot = async (req: Request, res: Response) => {
    const  userId  = req.user?.userId as string;

    try {
      const userDiscover = await userService.discoverPilot(userId);

      if (!userDiscover)
        return res.status(404).send("no hay Pilotos en tu zona");

      res.status(200).json({
        result: userDiscover,
      });
    } catch (error) {
      if (error instanceof Error) {
      res.status(500).json({
        error: error.message,
      });
    }}
  };

    respectPilot = async (req: Request, res: Response) => {
    const  userId  = req.user?.userId as string;
    const {respectUserId} = req.body

    try {
       await userService.respectPilot(userId,respectUserId);

      res.status(200).json({
        result: "respect",
      });
    } catch (error) {
      if (error instanceof Error) {
      res.status(500).json({
        error: error.message,
      });
    }}
  };


    getRespectPilot = async (req: Request, res: Response) => {
    const  userId  = req.user?.userId as string;

    try {
     const result =   await userService.getrespectPilot(userId);

      res.status(200).json({
        result: result,
      });
    } catch (error) {
      if (error instanceof Error) {
      res.status(500).json({
        error: error.message,
      });
    }}
  };

    


  //admin

    
UserAll = async (req: Request, res: Response) => {
    try {
     const result =   await userService.getUserAll();

       const resultMapper = userMapper.toDtoList(result)
      

      res.status(200).json({
        result: resultMapper,
      });
    } catch (error) {
      if (error instanceof Error) {
      res.status(500).json({
        error: error.message,
      });
    }}
  };


  UserAllSearch = async (req: Request, res: Response) => {
  const page = Number(req.query.page) || 1 as number
    const limit = Number(req.query.limit) || 10 as number
    const search = req.query.search?.toString() || "" as string
    const offset = (page - 1) * limit;


    try {
     const result =   await userService.getUserAllSearch(search,offset,limit);

       
      

      res.status(200).json({
        result: result,
      });
    } catch (error) {
      if (error instanceof Error) {
      res.status(500).json({
        error: error.message,
      });
    }}
  };


    
  

 
  
}
