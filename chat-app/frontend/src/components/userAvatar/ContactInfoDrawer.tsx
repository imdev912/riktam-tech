import {
  Text,
  Button,
  useDisclosure,
  IconButton,
  Flex,
  Drawer,
  DrawerOverlay,
  DrawerContent,
  DrawerHeader,
  DrawerBody,
} from "@chakra-ui/react";
import React, { ReactNode, useState } from "react";
import VisibilityIcon from '@mui/icons-material/Visibility';
import CloseIcon from '@mui/icons-material/Close';
import ContactInfoItem from "./ContactInfoItem";
import ProfilePic from "../miscellaneous/ProfilePic";
import UserType from "../../types/user";

interface Props {
  user: UserType;
  children?: ReactNode;
}

const ContactInfoDrawer: React.FC<Props> = ({ user, children }) => {
  const [image, setImage] = useState<string>(user.image);
  const[imageLoading, setImageLoading] = useState(false);
  const { isOpen, onOpen, onClose } = useDisclosure();

  return (
    <>
      {children ? (
        <span onClick={onOpen}>{children}</span>
      ) : (
        <IconButton display="flex" icon={<VisibilityIcon />} onClick={onOpen} aria-label="show/hide" />
      )}

      <Drawer size="md" placement="right" onClose={onClose} isOpen={isOpen}>
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
                <CloseIcon />
              </Button>

              <Text>
                Contact Info
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
                  update={false}
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
                  <ContactInfoItem
                    title="Full name"
                    content={user.name}
                    description="This is not the username or pin."
                  />

                  <ContactInfoItem
                    title="Email address"
                    content={user.email}
                  />

                  {
                    user.about ? (
                      <ContactInfoItem
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
        </DrawerContent>
      </Drawer>
    </>
  );
};

export default ContactInfoDrawer;