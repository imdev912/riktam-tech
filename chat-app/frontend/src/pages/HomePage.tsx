import { Box, Container, Tab, TabList, TabPanel, TabPanels, Tabs, Text } from "@chakra-ui/react";
import SignIn from "../components/authentication/SignIn";
import SignUp from "../components/authentication/SignUp";
import PersonAddAltTwoToneIcon from '@mui/icons-material/PersonAddAltTwoTone';
import PersonOutlineTwoToneIcon from '@mui/icons-material/PersonOutlineTwoTone';
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import UserType from "../types/user";

const HomePage: React.FC = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const userInfo: UserType = JSON.parse(localStorage.getItem("userInfo") || "{}");

    if (userInfo && Object.keys(userInfo).length) {
      navigate("/chat");
    }
  }, [navigate]);

  return (
    <Container maxW="xl" centerContent>
      <Box
        display="flex"
        justifyContent="center"
        padding={3}
        backgroundColor="rgba(255, 255, 255, 0.7)"
        width="100%"
        margin="40px 0 15px 0"
        borderRadius="lg"
        borderWidth="1px"
      >
        <Text
          fontSize="xxx-large"
          fontFamily={"Work Sans"}
        >
          riktam chat
        </Text>
      </Box>

      <Box
        color={"black"}
        width="100%"
        padding={4}
        backgroundColor="rgba(255, 255, 255, 0.7)"
        margin="40px 0 15px 0"
        borderRadius="lg"
        borderWidth="1px"
      >
        <Tabs variant='soft-rounded'>
          <TabList marginBottom="1em">
            <Tab width="50%" gap="5px">
              <PersonOutlineTwoToneIcon /> Sign In
            </Tab>

            <Tab width="50%" gap="5px">
              <PersonAddAltTwoToneIcon /> Sign Up
            </Tab>
          </TabList>

          <TabPanels>
            <TabPanel>
              <SignIn />
            </TabPanel>

            <TabPanel>
              <SignUp />
            </TabPanel>
          </TabPanels>
        </Tabs>
      </Box>
    </Container>
  );
}

export default HomePage;