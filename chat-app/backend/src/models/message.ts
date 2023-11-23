import mongoose, { Schema, Document } from "mongoose";

export interface IMessage extends Document {
  sender: mongoose.Schema.Types.ObjectId,
  content: string,
  chat: mongoose.Schema.Types.ObjectId,
  readBy: mongoose.Schema.Types.ObjectId[]
}

const MessageSchema: Schema = new mongoose.Schema(
  {
    sender: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    content: { type: String, trim: true },
    chat: { type: mongoose.Schema.Types.ObjectId, ref: "Chat" },
    readBy: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }]
  },
  {
    timestamps: true
  }
);

const Message = mongoose.model<IMessage>("Message", MessageSchema);
export default Message;