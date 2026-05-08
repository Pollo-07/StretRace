import 'dotenv/config';
import express, { Application } from "express"
import AppRouter from "./application/routes/app-router"
import  cookiesParser from "cookie-parser"
import cors from "cors";
import http from "http";
import { Server } from "socket.io";

const PORT = process.env.PORT || 3000
const App: Application = express()
export const usersIo = new Map()

const server = http.createServer(App)
export const io = new Server(server,{
  cors:{
    origin:"*"
  }
})

io.on("connection",(socket)=>{

 const userId = socket.handshake.query.userId
if (userId) {
    usersIo.set(userId, socket.id);
  }

  socket.on("disconnect",()=>{

    for (let [key, value] of usersIo.entries()) {
      if (value === socket.id) {
        usersIo.delete(key);
        break;
      }

    }

    
  })
})




App.use(cors({
  origin: [
    "http://localhost:5173",
   "https://proud-water-023456e10.7.azurestaticapps.net"
  ],
  credentials: true
}));

App.use(express.json())
App.use(cookiesParser())


App.use("/api",AppRouter)

App.get("/", (req, res) => {
  res.send("¡El servidor de StreetRace está vivo!");
});


server.listen(PORT, () => {
    console.log(`Servidor iniciado en el puerto: ${PORT}`);
});
