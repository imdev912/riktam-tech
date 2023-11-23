import axios from "axios";


interface Props {
  name: string;
  email: string;
  password: string;
  image: string;
  about: string;
}

const uploadUserData = async ({
  name,
  email,
  password,
  image,
  about
}: Props): Promise<boolean> => {
  try {
    const config = {
      headers: {
        "Content-type": "application/json",
      },
    };

    const { data } = await axios.post("/api/user/register",
      {
        name,
        email,
        password,
        image,
        about
      },
      config
    );

    localStorage.setItem("userInfo", JSON.stringify(data));

    return true;
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.log(error.message);
    }
  }

  return false;
};

export default uploadUserData;