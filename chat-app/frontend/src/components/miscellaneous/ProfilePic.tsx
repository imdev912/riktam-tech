import { Avatar, Button, Input, VStack, useToast } from "@chakra-ui/react";
import { useRef } from "react";
import PhotoCameraIcon from '@mui/icons-material/PhotoCamera';
import { isValidImage, updateUserImage, uploadImage } from "../../utility/uploadImage";
import { useChatState } from "../../context/ChatProvider";


interface Props {
  name: string;
  image: string;
  update: boolean;
  setImage: React.Dispatch<React.SetStateAction<string>>;
  imageLoading: boolean;
  setImageLoading: React.Dispatch<React.SetStateAction<boolean>>;
}

const ProfilePic: React.FC<Props> = ({
  name,
  image,
  update,
  setImage,
  imageLoading,
  setImageLoading
}) => {
  const imageRef = useRef<HTMLInputElement>(null);
  const toast = useToast();
  const { user } = useChatState();

  const handleImageClick = () => {
    const currentRef = imageRef.current;

    if (currentRef) {
      currentRef.click();
    }
  }

  const handleImageUpdate = async (imageURL: string) => {
    if (imageURL !== "") {
      const updatedUser = { ...user, image: imageURL };
      const updated = await updateUserImage(updatedUser);

      if (updated) {
        toast({
          title: "Profile pic updated successfully",
          status: "success",
          duration: 5000,
          isClosable: true,
          position: "bottom",
        });
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
  }

  const handleUploadImage = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const imageFile = e.target.files![0];
    const validImage = isValidImage(imageFile);

    if (validImage) {
      const imageURL = await uploadImage(
        {
          image: imageFile,
          setImage,
          setImageLoading
        }
      );

      if (imageURL !== "") {
        toast({
          title: "Profile pic uploaded successfully",
          status: "success",
          duration: 5000,
          isClosable: true,
          position: "bottom",
        });
      }

      // await handleImageUpdate(imageURL);
    } else {
      toast({
        title: "Please Select an Image!",
        status: "warning",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
    }
    
  }

  return (
    <>
      {
        (image || name) ? (
          <VStack>
            <Avatar
              size="2xl"
              name={name || "username"}
              src={image}
              boxShadow="base"
            />

            {
              update ? (
                <Button
                  variant="outline"
                  colorScheme="teal"
                  size="xs"
                  onClick={handleImageClick}
                  isLoading={imageLoading}
                  isDisabled={true}
                >
                  Change
                </Button>
              ) : (
                <></>
              )
            }
          </VStack>
        ) : (
          <Button
            variant="ghost"
            size={"2xl"}
            borderRadius="full"
            boxShadow="base"
            onClick={handleImageClick}
            isLoading={imageLoading}
          >
            <PhotoCameraIcon sx={{
              width: "100px",
              height: "100px",
              backgroundColor: "white",
              padding: "10px",
              borderRadius: "50%"
            }} />
          </Button>
        )
      }

      <Input
        ref={imageRef}
        type="file"
        p={1.5}
        accept="image/*"
        onChange={(e) => handleUploadImage(e)}
        hidden={true}
      />
    </>
  );
};

export default ProfilePic;