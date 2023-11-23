import { FormControl } from "@chakra-ui/form-control";
import { Input } from "@chakra-ui/input";
import { Box, Text } from "@chakra-ui/layout";
import "./styles.css";
import { IconButton, InputGroup, InputRightElement, Spinner, useToast } from "@chakra-ui/react";
import { getSender, getSenderFull } from "../config/chat";
import { useEffect, useState } from "react";
import axios from "axios";
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ScrollableChat from "./ScrollableChat";
import Lottie from "lottie-react";
import animationData from "../animations/typing.json";
import { io, Socket } from "socket.io-client";
import ContactInfoDrawer from "./userAvatar/ContactInfoDrawer";
import UpdateGroupChatModal from "./miscellaneous/UpdateGroupChatModal";
import { useChatState } from "../context/ChatProvider";
import Profile from "./navbar/Profile";
import MessageType from "../types/message";

const ENDPOINT: string = "http://localhost:7000";
let socket: Socket;
let selectedChatCompare: any;

const SingleChat: React.FC<{ fetchAgain: boolean, setFetchAgain: React.Dispatch<React.SetStateAction<boolean>> }> = ({ fetchAgain, setFetchAgain }) => {
  const [messages, setMessages] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [newMessage, setNewMessage] = useState<string>("");
  const [socketConnected, setSocketConnected] = useState<boolean>(false);
  const [typing, setTyping] = useState<boolean>(false);
  const [istyping, setIsTyping] = useState<boolean>(false);
  const toast = useToast();

  const {
    user,
    selectedChat,
    setSelectedChat,
    notification,
    setNotification
  } = useChatState();

  const closeChat = () => {
    setSelectedChat(null);
    selectedChatCompare = null;
  };

  const fetchMessages = async () => {
    if (!selectedChat) {
      return;
    }

    try {
      if (user.token) {
        setLoading(true);

        const config = {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        };

        const { data } = await axios.get(`/api/message/${selectedChat._id}`, config);
        setMessages(data);
        socket.emit("join chat", { userId: user._id, chatId: selectedChat._id });
      }
    } catch (error) {
      toast({
        title: "Error Occurred!",
        description: "Failed to Load the Messages",
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
    } finally {
      setLoading(false);
    }
  };

  const sendMessage = async (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter" && user && selectedChat && newMessage) {
      socket.emit("stop typing", selectedChat._id);
      
      try {
        const config = {
          headers: {
            "Content-type": "application/json",
            Authorization: `Bearer ${user.token}`,
          },
        };

        setNewMessage("");

        const { data } = await axios.post(
          "/api/message",
          {
            content: newMessage,
            chatId: selectedChat,
          },
          config
        );

        socket.emit("new message", data);
        setMessages([...messages, data]);
      } catch (error) {
        toast({
          title: "Error Occurred!",
          description: "Failed to send the Message",
          status: "error",
          duration: 5000,
          isClosable: true,
          position: "bottom",
        });
      }
    }
  };

  useEffect(() => {
    socket = io(ENDPOINT);
    socket.emit("setup", user);
    socket.on("connected", () => setSocketConnected(true));
    socket.on("typing", () => setIsTyping(true));
    socket.on("stop typing", () => setIsTyping(false));
    // eslint-disable-next-line
  }, []);

  useEffect(() => {
    fetchMessages();
    selectedChatCompare = selectedChat;
    // eslint-disable-next-line
  }, [selectedChat]);

  useEffect(() => {
    socket.on("message received", (newMessage: MessageType) => {
      // if chat is not selected or doesn't match current chat
      if (
        !selectedChatCompare ||
        selectedChatCompare._id !== newMessage.chat._id
      ) {
        if (!notification.includes(newMessage)) {
          setNotification([newMessage, ...notification]);
          setFetchAgain(!fetchAgain);
        }
      } else {
        setMessages([...messages, newMessage]);
      }
    });
  });

  const typingHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNewMessage(e.target.value);
    if (!socketConnected) return;

    if (selectedChat && !typing) {
      setTyping(true);
      socket.emit("typing", selectedChat._id);
    }

    let lastTypingTime = new Date().getTime();
    var timerLength = 3000;

    setTimeout(() => {
      var timeNow = new Date().getTime();
      var timeDiff = timeNow - lastTypingTime;

      if (timeDiff >= timerLength && selectedChat && typing) {
        socket.emit("stop typing", selectedChat._id);
        setTyping(false);
      }
    }, timerLength);
  };

  return (
    <>
      <Text
        fontSize={{ base: "28px", md: "30px" }}
        pb={3}
        px={2}
        w="100%"
        fontFamily="Work sans"
        display="flex"
        justifyContent={{ base: "space-between" }}
        alignItems="center"
      >
        <IconButton
          variant={"ghost"}
          display="flex"
          borderRadius={"full"}
          icon={<ArrowBackIcon />}
          onClick={closeChat}
          aria-label="back"
        />

        {messages && selectedChat &&
          (!selectedChat.isGroupChat ? (
            <>
              {getSender(user, selectedChat.users)}

              <ContactInfoDrawer user={getSenderFull(user, selectedChat.users)}>
                <Profile user={getSenderFull(user, selectedChat.users)} />
              </ContactInfoDrawer>
            </>
          ) : (
            <>
              {selectedChat.chatName.toUpperCase()}

              <UpdateGroupChatModal
                fetchMessages={fetchMessages}
                fetchAgain={fetchAgain}
                setFetchAgain={setFetchAgain}
              />
            </>
          ))}
      </Text>

      <Box
        display="flex"
        flexDir="column"
        justifyContent="flex-end"
        p={3}
        bg="#E8E8E8"
        w="100%"
        h="100%"
        borderRadius="lg"
        overflowY="hidden"
      >
        {loading ? (
          <Spinner size="xl" w={20} h={20} alignSelf="center" margin="auto" />
        ) : (
          <div className="messages">
            <ScrollableChat messages={messages} />
          </div>
        )}

        <FormControl onKeyDown={sendMessage} id="first-name" isRequired mt={3}>
          <InputGroup>
            <InputRightElement pointerEvents='none'>
              {istyping ? (
                <Lottie
                  animationData={animationData}
                  loop={true}
                  style={{
                    marginRight: "10px"
                  }}
                />
              ) : (
                <></>
              )}
            </InputRightElement>

            <Input
              variant="filled"
              bg="#E0E0E0"
              placeholder="Enter a message..."
              value={newMessage}
              autoComplete="off"
              onChange={typingHandler}
            />
          </InputGroup>
        </FormControl>
      </Box>
    </>
  );
};

export default SingleChat;