import uploadUserData from "./uploadUserData";
import UserType from "../types/user";

interface Props {
  image: File;
  setImage: React.Dispatch<React.SetStateAction<string>>;
  setImageLoading: React.Dispatch<React.SetStateAction<boolean>>;
}

export const updateUserImage = async (userInfo: UserType): Promise<boolean> => {

  if (userInfo && userInfo._id) {
    const { name, email, password, image, about } = userInfo;

    return await uploadUserData({
      name,
      email,
      password,
      image,
      about
    });
  }

  return false;
}

export const isValidImage = (image: File): boolean => {  
  if (image === undefined || !["image/jpeg", "image/png"].includes(image.type)) {
    return false;
  }

  return true;
}

export const uploadImage = async ({image, setImage, setImageLoading}: Props): Promise<string> => {
  setImageLoading(true);

  const formData = new FormData();
  formData.append("file", image);
  formData.append("upload_preset", "riktam-chat");
  formData.append("cloud_name", "imdev912");

  const uploadURL = `${process.env.REACT_APP_CLOUDINARY_URL!}/image/upload`;

  try {
    const resposne = await fetch(uploadURL, {
      method: "post",
      body: formData,
    });

    const data = await resposne.json();
    const imageURL: string = data.url.toString();

    setImage(imageURL);
    return imageURL;
  } catch (error) {
    console.log(error);
  } finally {
    setImageLoading(false);
  }

  return "";
};