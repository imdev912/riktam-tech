import { Button } from "@chakra-ui/button";
import { Input } from "@chakra-ui/input";
import { Box } from "@chakra-ui/layout";
import {
  Drawer,
  DrawerBody,
  DrawerContent,
  DrawerHeader,
  DrawerOverlay,
} from "@chakra-ui/modal";

import React, { useState } from "react";
import axios from "axios";
import { useToast } from "@chakra-ui/toast";
import { Spinner } from "@chakra-ui/spinner";

import ChatLoading from "../ChatLoading";
import UserListItem from "../userAvatar/UserListItem";

import { useChatState } from "../../context/ChatProvider";
import UserType from "../../types/user";


interface Props {
  isOpen: boolean,
  onClose: () => void
}

const SideDrawer: React.FC<Props> = ({ isOpen, onClose }) => {
  const [search, setSearch] = useState("");
  const [searchResult, setSearchResult] = useState<UserType[]>([]);
  const [loading, setLoading] = useState(false);
  const [loadingChat, setLoadingChat] = useState(false);
  const {
    setSelectedChat,
    user,
    chats,
    setChats,
  } = useChatState();
  const toast = useToast();

  const handleSearch = async () => {
    if (!search) {
      toast({
        title: "Please Enter something in search",
        status: "warning",
        duration: 5000,
        isClosable: true,
        position: "top-left",
      });

      return;
    }

    try {
      setLoading(true);

      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };

      const { data } = await axios.get(`/api/user?search=${search}`, config);

      setLoading(false);
      setSearchResult(data);
    } catch (error) {
      toast({
        title: "Error Occured!",
        description: "Failed to Load the Search Results",
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom-left",
      });
    }
  };

  const accessChat = async (userId: string) => {
    try {
      if (user) {
        setLoadingChat(true);

        const config = {
          headers: {
            "Content-type": "application/json",
            Authorization: `Bearer ${user.token}`,
          },
        };

        const { data } = await axios.post(`/api/chat`, { userId }, config);

        if (chats && !chats.find((c) => c._id === data._id)) {
          setChats([data, ...chats])
        };

        setSelectedChat(data);
        setLoadingChat(false);
        onClose();
      }
    } catch (error) {
      if (error instanceof Error) {
        toast({
          title: "Error fetching the chat",
          description: error.message,
          status: "error",
          duration: 5000,
          isClosable: true,
          position: "bottom-left",
        });
      }
    }
  };

  return (
    <Drawer size="md" placement="left" onClose={onClose} isOpen={isOpen}>
      <DrawerOverlay />

      <DrawerContent>
        <DrawerHeader>
          Search Users
        </DrawerHeader>

        <DrawerBody>
          <Box display="flex" pb={2}>
            <Input
              placeholder="Search by name or email"
              mr={2}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />

            <Button onClick={handleSearch}>
              Go
            </Button>
          </Box>

          {loading ? (
            <ChatLoading />
          ) : (
            searchResult.map((result) => (
              <UserListItem
                key={result._id}
                user={result}
                handleFunction={() => accessChat(result._id)}
              />
            ))
          )}

          {loadingChat ? <Spinner ml="auto" display="flex" /> : <></>}
        </DrawerBody>
      </DrawerContent>
    </Drawer>
  );
}

export default SideDrawer;