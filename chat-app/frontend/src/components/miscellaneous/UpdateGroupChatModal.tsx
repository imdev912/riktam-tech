import VisibilityIcon from '@mui/icons-material/Visibility';
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Button,
  useDisclosure,
  FormControl,
  Input,
  useToast,
  Box,
  IconButton,
  Spinner,
} from "@chakra-ui/react";
import axios from "axios";
import { useState } from "react";
import { useChatState } from "../../context/ChatProvider";
import UserBadgeItem from "../userAvatar/UserBadgeItem";
import UserListItem from "../userAvatar/UserListItem";

interface Props {
  fetchMessages: () => void;
  fetchAgain: boolean;
  setFetchAgain: (value: boolean) => void;
}

const UpdateGroupChatModal: React.FC<Props> = ({
  fetchMessages,
  fetchAgain,
  setFetchAgain,
}) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [groupChatName, setGroupChatName] = useState<string>();
  const [search, setSearch] = useState<string>("");
  const [searchResult, setSearchResult] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [renameloading, setRenameLoading] = useState<boolean>(false);
  const toast = useToast();
  const { selectedChat, setSelectedChat, user } = useChatState();

  const handleSearch = async (query: string) => {
    setSearch(query);

    if (!query) {
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
      setSearchResult(data);
    } catch (error) {
      toast({
        title: "Error Occurred!",
        description: "Failed to Load the Search Results",
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom-left",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleRename = async () => {
    if (!groupChatName) return;

    try {
      if (user) {
        setRenameLoading(true);

        const config = {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        };

        if (selectedChat) {
          const { data } = await axios.put(
            `/api/chat/group/rename`,
            {
              chatId: selectedChat._id,
              chatName: groupChatName,
            },
            config
          );

          console.log(data._id);
          setSelectedChat(data);
        }

        setFetchAgain(!fetchAgain);
        setRenameLoading(false);
      }
    } catch (error) {
      if (error instanceof Error) {
        toast({
          title: "Error Occurred!",
          description: error.message,
          status: "error",
          duration: 5000,
          isClosable: true,
          position: "bottom",
        });
      }

      setRenameLoading(false);
    }

    setGroupChatName("");
  };

  const handleAddUser = async (user1: any) => {
    if (selectedChat && selectedChat.users.find((u: any) => u._id === user1._id)) {
      toast({
        title: "User Already in group!",
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
      return;
    }

    if (selectedChat && user && selectedChat.groupAdmin._id !== user._id) {
      toast({
        title: "Only admins can add someone!",
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
      return;
    }

    try {
      if (user) {
        setLoading(true);
        const config = {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        };

        if (selectedChat) {
          const { data } = await axios.put(
            `/api/chat/group/add`,
            {
              chatId: selectedChat._id,
              userId: user1._id,
            },
            config
          );

          setSelectedChat(data);
        }

        setFetchAgain(!fetchAgain);
        setLoading(false);
      }
    } catch (error) {
      if (error instanceof Error) {
        toast({
          title: "Error Occurred!",
          description: error.message,
          status: "error",
          duration: 5000,
          isClosable: true,
          position: "bottom",
        });
      }

      setLoading(false);
    }
    setGroupChatName("");
  };

  const handleRemove = async (user1: any) => {
    if (selectedChat && user && selectedChat.groupAdmin._id !== user._id && user1._id !== user._id) {
      toast({
        title: "Only admins can remove someone!",
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
      return;
    }
    try {
      if (user) {
        setLoading(true);

        const config = {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        };

        if (selectedChat) {
          const { data } = await axios.put(
            `/api/chat/group/remove`,
            {
              chatId: selectedChat._id,
              userId: user1._id,
            },
            config
          );

          user1._id === user._id ? setSelectedChat(null) : setSelectedChat(data);
        }

        setFetchAgain(!fetchAgain);
        fetchMessages();
        setLoading(false);
      }
    } catch (error) {
      if (error instanceof Error) {
        toast({
          title: "Error Occurred!",
          description: error.message,
          status: "error",
          duration: 5000,
          isClosable: true,
          position: "bottom",
        });
      }

      setLoading(false);
    }

    setGroupChatName("");
  };

  return (
    <>
      <IconButton display="flex" icon={<VisibilityIcon />} onClick={onOpen} aria-label="view" />

      {selectedChat && (
        <Modal onClose={onClose} isOpen={isOpen} isCentered>
          <ModalOverlay />
          <ModalContent>
            <ModalHeader
              fontSize="35px"
              fontFamily="Work sans"
              display="flex"
              justifyContent="center"
            >
              {selectedChat.chatName}
            </ModalHeader>

            <ModalCloseButton />

            <ModalBody display="flex" flexDir="column" alignItems="center">
              <Box w="100%" display="flex" flexWrap="wrap" pb={3}>
                {selectedChat.users.map((u) => (
                  <UserBadgeItem
                    key={u._id}
                    user={u}
                    admin={selectedChat.groupAdmin}
                    handleFunction={() => handleRemove(u)}
                  />
                ))}
              </Box>

              <FormControl display="flex">
                <Input
                  placeholder="Chat Name"
                  mb={3}
                  value={groupChatName}
                  onChange={(e) => setGroupChatName(e.target.value)}
                />

                <Button
                  variant="solid"
                  colorScheme="teal"
                  ml={1}
                  isLoading={renameloading}
                  onClick={handleRename}
                >
                  Update
                </Button>
              </FormControl>

              <FormControl>
                <Input
                  placeholder="Add User to group"
                  mb={1}
                  onChange={(e) => handleSearch(e.target.value)}
                />
              </FormControl>

              {loading ? (
                <Spinner size="lg" />
              ) : (
                searchResult.map((result) => (
                  <UserListItem
                    key={result._id}
                    user={result}
                    handleFunction={() => handleAddUser(result)}
                  />
                ))
              )}
            </ModalBody>
            
            <ModalFooter>
              <Button onClick={() => handleRemove(user)} colorScheme="red">
                Leave Group
              </Button>
            </ModalFooter>
          </ModalContent>
        </Modal>
      )}
    </>
  );
};

export default UpdateGroupChatModal;