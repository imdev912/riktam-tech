import { useState } from "react";
import { Box, Textarea } from "@chakra-ui/react";
import { Button } from "@chakra-ui/button";
import { FormControl } from "@chakra-ui/form-control";
import { Input, InputGroup, InputRightElement, InputLeftElement } from "@chakra-ui/input";
import { VStack } from "@chakra-ui/layout";
import { useToast } from "@chakra-ui/toast";
import { useNavigate } from "react-router-dom";

import PersonIcon from '@mui/icons-material/Person';
import AlternateEmailIcon from '@mui/icons-material/AlternateEmail';
import LockIcon from '@mui/icons-material/Lock';
import PasswordIcon from '@mui/icons-material/Password';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import ProfilePic from "../miscellaneous/ProfilePic";
import uploadUserData from "../../utility/uploadUserData";


const SignUp: React.FC = () => {
  const [name, setName] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [confirmPassword, setConfirmPassword] = useState<string>("");
  const [image, setImage] = useState<string>("");
  const [about, setAbout] = useState<string>("");

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [imageLoading, setImageLoading] = useState(false);

  const toast = useToast();
  const navigate = useNavigate();

  const isValidData = (): boolean => {
    if (!name || !email || !password || !confirmPassword) {
      toast({
        title: "Please Fill all the Fields",
        status: "warning",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });

      return false;
    }

    if (password !== confirmPassword) {
      toast({
        title: "Passwords Do Not Match",
        status: "warning",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });

      return false;
    }

    return true;
  }

  const submitHandler = async () => {
    setImageLoading(true);

    if (isValidData()) {
      const userAdded = await uploadUserData({
        name,
        email,
        password,
        image,
        about
      });

      if (userAdded) {
        toast({
          title: "Registration Successful",
          status: "success",
          duration: 5000,
          isClosable: true,
          position: "bottom",
        });

        navigate("/chat");
      } else {
        toast({
          title: "Error Occurred!",
          description: "Please retry after sometime",
          status: "error",
          duration: 5000,
          isClosable: true,
          position: "bottom",
        });
      }
    }

    setImageLoading(false);
  };

  return (
    <VStack spacing="10px">
      <Box marginBottom="20px">
        <ProfilePic
          name=""
          image={image}
          update={true}
          setImage={setImage}
          imageLoading={imageLoading}
          setImageLoading={setImageLoading}
        />
      </Box>

      <FormControl id="full-name" isRequired>
        <InputGroup>
          <InputLeftElement pointerEvents='none'>
            <PersonIcon />
          </InputLeftElement>

          <Input
            variant="filled"
            type="text"
            value={name}
            placeholder="Full Name"
            onChange={(e) => setName(e.target.value)}
          />
        </InputGroup>
      </FormControl>

      <FormControl id="email" isRequired>
        <InputGroup>
          <InputLeftElement pointerEvents='none'>
            <AlternateEmailIcon />
          </InputLeftElement>

          <Input
            variant="filled"
            type="email"
            value={email}
            placeholder="Email"
            onChange={(e) => setEmail(e.target.value)}
          />
        </InputGroup>
      </FormControl>

      <FormControl id="password" isRequired>
        <InputGroup>
          <InputLeftElement pointerEvents='none'>
            <LockIcon />
          </InputLeftElement>

          <Input
            variant="filled"
            type={showPassword ? "text" : "password"}
            value={password}
            placeholder="Password"
            onChange={(e) => setPassword(e.target.value)}
          />

          <InputRightElement paddingRight="8px">
            <Button h="1.75rem" size="sm" onClick={() => setShowPassword(!showPassword)}>
              {showPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}
            </Button>
          </InputRightElement>
        </InputGroup>
      </FormControl>

      <FormControl id="confirm-password" isRequired>
        <InputGroup>
          <InputLeftElement pointerEvents='none'>
            <PasswordIcon />
          </InputLeftElement>

          <Input
            variant="filled"
            value={confirmPassword}
            type={showConfirmPassword ? "text" : "password"}
            placeholder="Confirm Password"
            onChange={(e) => setConfirmPassword(e.target.value)}
          />

          <InputRightElement paddingRight="8px">
            <Button h="1.75rem" size="sm" onClick={() => setShowConfirmPassword(!showConfirmPassword)}>
              {showConfirmPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}
            </Button>
          </InputRightElement>
        </InputGroup>
      </FormControl>

      <Textarea
        variant="filled"
        value={about}
        placeholder="Tell us about yourself"
        onChange={(e) => setAbout(e.target.value)}
      />

      <Button
        colorScheme="blue"
        width="100%"
        style={{ marginTop: 15 }}
        onClick={submitHandler}
        isLoading={imageLoading}
      >
        Sign Up
      </Button>
    </VStack>
  );
};

export default SignUp;