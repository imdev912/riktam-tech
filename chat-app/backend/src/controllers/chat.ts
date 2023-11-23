import { Request, Response } from "express";
import asyncHandler from "express-async-handler";
import User from "../models/user";
import Chat from "../models/chat";
import Message from "../models/message";


//@description     Create or fetch One to One Chat
//@route           POST /api/chat/
//@access          Protected
const accessChat = asyncHandler(async (req: Request, res: Response): Promise<void> => {
  const { userId } = req.body;

  if (!userId) {
    console.log("UserId param not sent with request");
    res.status(400)
    .json({
      error: "userId is required"
    });

    throw new Error("userId is required");
  }

  const isChat = await Chat.find({
    isGroupChat: false,
    $and: [
      { users: { $elemMatch: { $eq: req.user._id } } },
      { users: { $elemMatch: { $eq: userId } } },
    ],
  })
    .populate("users", "-password")
    .populate({
      model: Message,
      path: "latestMessage",
      select: "sender content"
    });

  await User.populate(isChat, {
    path: "latestMessage.sender",
    select: "name email image",
  });

  if (isChat.length > 0) {
    res.send(isChat[0]);
  } else {
    const chatData = {
      chatName: "sender",
      isGroupChat: false,
      users: [req.user._id, userId],
    };

    try {
      const createdChat = await Chat.create(chatData);
      const FullChat = await Chat.findOne({ _id: createdChat._id })
        .populate("users", "-password")
        .populate({
          model: Message,
          path: "latestMessage",
          select: "sender content",
        });

      res.status(200).json(FullChat);
    } catch (error) {
      res.status(400);

      if (error instanceof Error) {
        throw new Error(error.message);
      }
    }
  }
});

//@description     Fetch all chats for a user
//@route           GET /api/chat/
//@access          Protected
const fetchChats = asyncHandler(async (req: Request, res: Response): Promise<void> => {
  try {
    const results = await Chat.find({ users: { $elemMatch: { $eq: req.user._id } } })
      .populate("users", "-password")
      .populate("groupAdmin", "-password")
      .populate("latestMessage")
      .sort({ updatedAt: -1 });

    const populatedResults = await User.populate(results, {
      path: "latestMessage.sender",
      select: "name email image",
    });

    res.status(200).send(populatedResults);
  } catch (error) {
    res.status(400);

    if (error instanceof Error) {
      throw new Error(error.message);
    }
  }
});

//@description     Create New Group Chat
//@route           POST /api/chat/group
//@access          Protected
const createGroupChat = asyncHandler(async (req: Request, res: Response): Promise<void> => {
  if (!req.body.users || !req.body.name) {
    res.status(400).send({ message: "Please fill in all the fields" });
    return;
  }

  const users: string[] = JSON.parse(req.body.users);
  if (users.length < 2) {
    res.status(400).send("More than 2 users are required to form a group chat");
    return;
  }

  users.push(req.user._id.toString());

  try {
    const groupChat = await Chat.create({
      chatName: req.body.name,
      users: users,
      isGroupChat: true,
      groupAdmin: req.user._id.toString(),
    });

    const fullGroupChat = await Chat.findOne({ _id: groupChat._id })
      .populate("users", "-password")
      .populate("groupAdmin", "-password");

    res.status(200).json(fullGroupChat);
  } catch (error) {
    res.status(400);

    if (error instanceof Error) {
      throw new Error(error.message);
    }
  }
});

// @desc    Rename Group
// @route   PUT /api/chat/rename
// @access  Protected
const renameGroup = asyncHandler(async (req: Request, res: Response): Promise<void> => {
  const { chatId, chatName } = req.body;
  const updatedChat = await Chat.findByIdAndUpdate(
    chatId,
    {
      chatName: chatName,
    },
    {
      new: true,
    }
  )
    .populate("users", "-password")
    .populate("groupAdmin", "-password");

  if (!updatedChat) {
    res.status(404);
    throw new Error("Chat Not Found");
  } else {
    res.json(updatedChat);
  }
});

// @desc    Remove user from Group
// @route   PUT /api/chat/groupremove
// @access  Protected
const removeFromGroup = asyncHandler(async (req: Request, res: Response): Promise<void> => {
  const { chatId, userId } = req.body;
  // check if the requester is admin
  const removed = await Chat.findByIdAndUpdate(
    chatId,
    {
      $pull: { users: userId },
    },
    {
      new: true,
    }
  )
    .populate("users", "-password")
    .populate("groupAdmin", "-password");
  if (!removed) {
    res.status(404);
    throw new Error("Chat Not Found");
  } else {
    res.json(removed);
  }
});

// @desc    Add user to Group / Leave
// @route   PUT /api/chat/groupadd
// @access  Protected
const addToGroup = asyncHandler(async (req: Request, res: Response): Promise<void> => {
  const { chatId, userId } = req.body;
  // check if the requester is admin
  const added = await Chat.findByIdAndUpdate(
    chatId,
    {
      $push: { users: userId },
    },
    {
      new: true,
    }
  )
    .populate("users", "-password")
    .populate("groupAdmin", "-password");
  if (!added) {
    res.status(404);
    throw new Error("Chat Not Found");
  } else {
    res.json(added);
  }
});

export {
  accessChat,
  fetchChats,
  createGroupChat,
  renameGroup,
  addToGroup,
  removeFromGroup,
};