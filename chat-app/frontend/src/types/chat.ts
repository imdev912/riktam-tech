import UserType from "./user";
import MessageType from "./message";

interface ChatType {
  _id: string;
  chatName: string;
  users: UserType[];
  isGroupChat: boolean;
  latestMessage?: MessageType;
  groupAdmin: UserType;
}

export default ChatType;