import CloseIcon from '@mui/icons-material/Close';
import { Badge } from "@chakra-ui/layout";
import UserType from '../../types/user';

interface UserBadgeItemProps {
  user: UserType;
  handleFunction: () => void;
  admin?: UserType;
}

const UserBadgeItem: React.FC<UserBadgeItemProps> = ({ user, handleFunction, admin }) => {
  return (
    <Badge
      px={2}
      py={1}
      borderRadius="lg"
      m={1}
      mb={2}
      variant="solid"
      fontSize={12}
      colorScheme="purple"
      cursor="pointer"
      onClick={handleFunction}
    >
      {user.name}
      {admin && admin._id === user._id && <span> (Admin)</span>}
      <CloseIcon sx={{paddingLeft: "5px"}} />
    </Badge>
  );
};

export default UserBadgeItem;