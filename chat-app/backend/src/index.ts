import { createServer } from "./app";
import { Server, Socket } from "socket.io";
import dotenv from "dotenv";
import { connectDB } from "../config/db";
import User, { IUser } from "./models/user";
import { IMessage } from "./models/message";
import Chat from "./models/chat";


dotenv.config();
connectDB();

const server = createServer();

const io: Server = new Server(server, {
  pingTimeout: 60000,
  cors: {
    origin: "http://localhost:3000",
    // credentials: true,
  },
});

io.on("connection", (socket: Socket) => {
  console.log("Connected to socket.io");

  socket.on("setup", (userData: IUser) => {
    const userId = userData._id.toString();
    socket.join(userId);
    console.log(`User Connected: ${userId}`);
    socket.emit("connected");
  });

  socket.on("join chat", ({ userId, chatId }: {userId: string; chatId: string;}) => {
    socket.join(chatId);
    console.log(`User ${userId} Joined Room ${chatId}`);
  });

  socket.on("typing", (room) => socket.in(room).emit("typing"));
  socket.on("stop typing", (room) => socket.in(room).emit("stop typing"));

  socket.on("new message", async (message: IMessage) => {
    const sender = await User.findById(message.sender);
    const chat = await Chat.findById(message.chat);

    if (!sender) return console.log("chat sender is not defined");
    if (!chat || !chat.users) return console.log("chat users are not defined");

    const chatId = chat._id.toString();
    const messageId = message._id.toString();
    const senderId = sender._id.toString();

    console.log(`Chat Room: ${chatId}`);
    console.log(`Message: ${messageId}`);
    console.log(`Sender: ${senderId}`);

    chat.users.forEach(async (user) => {
      const userId = user.toString();
      if (userId === senderId) return;
      console.log(`Receiver: ${userId}`);
      socket.in(userId).emit("message received", message);
    });
  });

  socket.on("disconnect", () => {
    console.log("USER DISCONNECTED");
  });
});