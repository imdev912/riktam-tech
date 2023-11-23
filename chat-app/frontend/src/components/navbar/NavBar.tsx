import { Box, Text } from "@chakra-ui/layout";
import {
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
} from "@chakra-ui/menu";
import { Tooltip } from "@chakra-ui/tooltip"

import Badge from "@mui/material/Badge";
import NotificationsIcon from '@mui/icons-material/Notifications';
import SearchIcon from '@mui/icons-material/Search';

import { getSender } from "../../config/chat";
import { Button, Flex } from "@chakra-ui/react";
import { useChatState } from "../../context/ChatProvider";
import Profile from "./Profile";
import ProfileInfoDrawer from "./ProfileInfoDrawer";

interface Props {
  onOpen: () => void
}

const NavBar: React.FC<Props> = ({ onOpen }) => {
  const {
    setSelectedChat,
    user,
    notification,
    setNotification,
  } = useChatState();

  return (
    <Box
      display="flex"
      justifyContent="space-between"
      alignItems="center"
      bg="white"
      w="100%"
      p="5px 10px 5px 10px"
      borderWidth="5px"
    >
      <Flex
        alignItems={"center"}
        gap={3}
      >
        <ProfileInfoDrawer user={user}>
          <Profile user={user} />
        </ProfileInfoDrawer>

        <Tooltip label="Search Users to chat" hasArrow placement="bottom-end">
          <Button variant="ghost" onClick={onOpen}>
            <SearchIcon />

            <Text display={{ base: "none", md: "flex" }} px={4}>
              Search User
            </Text>
          </Button>
        </Tooltip>
      </Flex>

      <Text fontSize="2xl" fontFamily="Work sans">
        riktam chat
      </Text>

      <div>
        <Menu>
          <MenuButton p={1}>
            <Badge badgeContent={notification.length} color="primary">
              <NotificationsIcon color="action" />
            </Badge>
          </MenuButton>

          <MenuList pl={2}>
            {!notification.length && "No New Messages"}

            {notification.map((notif) => (
              <MenuItem
                key={notif._id}
                onClick={() => {
                  setSelectedChat(notif.chat);
                  setNotification(notification.filter((n) => n !== notif));
                }}
              >
                {notif.chat.isGroupChat
                  ? `New Message in ${notif.chat.chatName}`
                  : `New Message from ${getSender(user, notif.chat.users)}`}
              </MenuItem>
            ))}
          </MenuList>
        </Menu>
      </div>
    </Box>
  )
}

export default NavBar;