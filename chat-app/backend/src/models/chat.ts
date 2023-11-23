import mongoose, { Schema, Document } from "mongoose";

export interface IChat extends Document {
  chatName: string;
  users: mongoose.Schema.Types.ObjectId[];
  isGroupChat: boolean;
  latestMessage: mongoose.Schema.Types.ObjectId;
  groupAdmin: mongoose.Schema.Types.ObjectId;
}

const ChatSchema: Schema = new mongoose.Schema(
  {
    chatName: { type: String, trim: true },
    users: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    isGroupChat: { type: Boolean, default: false },
    latestMessage: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Message",
    },
    groupAdmin: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  },
  {
    timestamps: true,
  }
);

const Chat = mongoose.model<IChat>("Chat", ChatSchema);
export default Chat;