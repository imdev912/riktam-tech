import React, { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { useNavigate } from "react-router-dom";
import ChatType from "../types/chat";
import UserType from "../types/user";

interface ChatContextProps {
  selectedChat: ChatType | null;
  setSelectedChat: React.Dispatch<React.SetStateAction<ChatType | null>>;
  user: UserType;
  setUser: React.Dispatch<React.SetStateAction<UserType>>;
  notification: any[];
  setNotification: React.Dispatch<React.SetStateAction<any[]>>;
  chats: ChatType[];
  setChats: React.Dispatch<React.SetStateAction<ChatType[]>>;
}

const demoUser: UserType = {
  _id: "",
  name: "Bob",
  email: "bob@example.com",
  password: "password",
  image: "https://i.pravatar.cc/150?img=2",
  about: "Hi, I'm Bob!",
  isAdmin: false,
  token: "",
};

const ChatContext = createContext<ChatContextProps>({
  selectedChat: null,
  setSelectedChat: () => { },
  user: demoUser,
  setUser: () => { },
  notification: [],
  setNotification: () => { },
  chats: [],
  setChats: () => { },
});

const ChatProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserType>(demoUser);
  const [selectedChat, setSelectedChat] = useState<ChatType | null>(null);
  const [notification, setNotification] = useState<any[]>([]);
  const [chats, setChats] = useState<ChatType[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    const userInfo: UserType = JSON.parse(localStorage.getItem("userInfo") || "{}");
    setUser(userInfo);

    if (!userInfo || !Object.keys(userInfo).length) {
      navigate("/");
    }
  }, [navigate]);

  return (
    <ChatContext.Provider
      value={{
        selectedChat,
        setSelectedChat,
        user,
        setUser,
        notification,
        setNotification,
        chats,
        setChats,
      }}
    >
      {children}
    </ChatContext.Provider>
  );
};

export const useChatState = (): ChatContextProps => {
  return useContext(ChatContext);
};

export default ChatProvider;