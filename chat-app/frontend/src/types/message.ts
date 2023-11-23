import UserType from "./user";
import ChatType from "./chat";

interface MessageType {
  _id: string;
  sender: UserType,
  content: string,
  chat: ChatType
  readBy: UserType[]
}

export default MessageType;