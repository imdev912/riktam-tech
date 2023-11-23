import { useDisclosure } from "@chakra-ui/react";
import NavBar from "../navbar/NavBar"
import SideDrawer from "./SideDrawer"

const Header: React.FC = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();

  return (
    <>
      <NavBar onOpen={onOpen} />
      <SideDrawer isOpen={isOpen} onClose={onClose} />
    </>
  );
};

export default Header;