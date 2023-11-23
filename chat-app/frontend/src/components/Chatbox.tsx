import { Box, Text } from "@chakra-ui/layout";
import "./styles.css";
import SingleChat from "./SingleChat";
import { useChatState } from "../context/ChatProvider";

interface ChatboxProps {
  fetchAgain: boolean;
  setFetchAgain: React.Dispatch<React.SetStateAction<boolean>>;
}

const Chatbox: React.FC<ChatboxProps> = ({ fetchAgain, setFetchAgain }) => {
  const { user, selectedChat } = useChatState();

  return (
    <Box
      display={{ base: selectedChat ? "flex" : "none", md: "flex" }}
      alignItems="center"
      flexDir="column"
      p={3}
      bg="white"
      w={{ base: "100%", md: "68%" }}
      borderRadius="lg"
      borderWidth="1px"
    >
      {user && user._id && selectedChat ? (
        <SingleChat
          fetchAgain={fetchAgain}
          setFetchAgain={setFetchAgain}
        />
      ) : (
          <Text fontSize="3xl" pb={3} fontFamily="Work sans">
          Click on a user to start chatting
        </Text >
      )}
    </Box>
  );
};

export default Chatbox;