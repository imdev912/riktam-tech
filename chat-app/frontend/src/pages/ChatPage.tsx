import { Box } from "@chakra-ui/layout";
import { useEffect, useState } from "react";
import Chatbox from "../components/Chatbox";
import MyChats from "../components/MyChats";
import { useChatState } from "../context/ChatProvider";
import Header from "../components/miscellaneous/Header";

const Chatpage = (): JSX.Element => {
  const [fetchAgain, setFetchAgain] = useState<boolean>(false);
  const { user } = useChatState();

  useEffect(() => {
    setFetchAgain(true);
  }, [user]);

  return (
    <div style={{ width: "100%" }}>
      <Header />

      <Box
        display="flex"
        justifyContent="space-between"
        w="100%"
        h="91.5vh"
        p="10px"
      >
        <MyChats fetchAgain={fetchAgain} />
        <Chatbox fetchAgain={fetchAgain} setFetchAgain={setFetchAgain} />
      </Box>
    </div>
  );
};

export default Chatpage;