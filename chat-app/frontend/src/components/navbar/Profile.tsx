import { Avatar } from "@chakra-ui/avatar";
import UserType from "../../types/user";

interface Props {
  user: UserType;
}

const Profile: React.FC<Props> = ({ user }) => {
  return (
    <Avatar
      size="md"
      cursor="pointer"
      name={user.name}
      src={user.image}
      boxShadow="base"
    />
  );
};

export default Profile;