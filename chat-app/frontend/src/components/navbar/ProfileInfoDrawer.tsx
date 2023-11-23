import {
  Text,
  Button,
  useDisclosure,
  IconButton,
  ButtonGroup,
  Flex,
  Drawer,
  DrawerOverlay,
  DrawerContent,
  DrawerHeader,
  DrawerBody,
  DrawerFooter,
} from "@chakra-ui/react";
import React, { ReactNode, useState } from "react";
import VisibilityIcon from '@mui/icons-material/Visibility';
import { useNavigate } from "react-router-dom";
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ProfileInfoItem from "./ProfileInfoItem";
import ProfilePic from "../miscellaneous/ProfilePic";
import UserType from "../../types/user";

interface Props {
  user: UserType;
  children?: ReactNode;
}

const ProfileInfoDrawer: React.FC<Props> = ({ user, children }) => {
  const [image, setImage] = useState<string>(user.image);
  const[imageLoading, setImageLoading] = useState(false);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const navigate = useNavigate();

  const logoutHandler = () => {
    localStorage.removeItem("userInfo");
    navigate("/");
  };

  return (
    <>
      {children ? (
        <span onClick={onOpen}>{children}</span>
      ) : (
        <IconButton display="flex" icon={<VisibilityIcon />} onClick={onOpen} aria-label="show/hide" />
      )}

      <Drawer size="md" placement="left" onClose={onClose} isOpen={isOpen}>
        <DrawerOverlay />

        <DrawerContent>
          <DrawerHeader>
            <Flex justifyContent={"space-between"}>
              <Button
                variant="ghost"
                size="sm"
                paddingLeft={0}
                _hover={{ bg: "white" }}
                onClick={onClose}
              >
                <ArrowBackIcon />
              </Button>

              <Text>
                Profile
              </Text>
            </Flex>
          </DrawerHeader>

          <DrawerBody>
            <Flex
              flexDirection={"column"}
              gap={"80px"}
            >
              <Flex justifyContent={"center"}>
                <ProfilePic
                  name={user.name}
                  image={user.image}
                  update={true}
                  setImage={setImage}
                  imageLoading={imageLoading}
                  setImageLoading={setImageLoading}
                />
              </Flex>

              {user ? (
                <Flex
                  flexDirection={"column"}
                  gap={5}
                >
                  <ProfileInfoItem
                    title="Your name"
                    content={user.name}
                    description="This is not your username or pin. This name will be visible to your contacts."
                  />

                  <ProfileInfoItem
                    title="Your email"
                    content={user.email}
                  />

                  {
                    user.about ? (
                      <ProfileInfoItem
                        title="About"
                        content={user.about}
                      />
                    ) : (
                      <></>
                    )
                  }
                </Flex>
              ) : (
                <></>
              )}
            </Flex>
          </DrawerBody>

          <DrawerFooter>
            <ButtonGroup variant="outline" spacing="6">
              <Button onClick={logoutHandler}>
                Log out
              </Button>
            </ButtonGroup>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>
    </>
  );
};

export default ProfileInfoDrawer;