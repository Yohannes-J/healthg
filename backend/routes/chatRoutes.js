import express from "express";
import {
  getChat,
  sendMessage,
  updateMessage,
} from "../controllers/chatController.js";


//import authDoctor from "../middlewares/authDoctor.js";
//import authUser from "../middlewares/authUser.js";


const chatRouter = express.Router();

chatRouter.post("/send", sendMessage);
chatRouter.get("/get", getChat);
chatRouter.put("/update/:id", updateMessage);

export default chatRouter;
