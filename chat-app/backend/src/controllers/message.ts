import { Request, Response } from "express";
import asyncHandler from "express-async-handler";
import Message from "../models/message";
import Chat from "../models/chat";

// @description     Get all Messages
// @route           GET /api/Message/:chatId
// @access          Protected
const allMessages = asyncHandler(async (req: Request, res: Response): Promise<void> => {
  try {
    const messages = await Message.find({ chat: req.params.chatId })
      .populate("sender", "name email image")
      .populate("chat");

    res.json(messages);
  } catch (error) {
    res.status(400);

    if (error instanceof Error) {
      throw new Error(error.message);
    }
  }
});

// @description     Create New Message
// @route           POST /api/Message/
// @access          Protected
const sendMessage = asyncHandler(async (req: Request, res: Response): Promise<void> => {
  const { content, chatId } = req.body;

  if (!content || !chatId) {
    console.log("Invalid data passed into request");
    res.sendStatus(400);
    return;
  }

  const newMessage = {
    sender: req.user._id,
    content: content,
    chat: chatId,
  };

  try {
    let message = await Message.create(newMessage);

    message = await message.populate([
      {
        path: "sender",
        select: "name image"
      },
      {
        path: "chat",
        populate: {
          path: "users",
          select: "name email image",
        }
      }
    ]);

    await Chat.findByIdAndUpdate(req.body.chatId, { latestMessage: message });
    res.json(message);
  } catch (error) {
    res.status(400);

    if (error instanceof Error) {
      throw new Error(error.message);
    }
  }
});

export { allMessages, sendMessage };
