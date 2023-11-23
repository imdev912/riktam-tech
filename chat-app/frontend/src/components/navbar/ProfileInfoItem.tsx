import {
  Button,
  Text,
  Flex,
} from "@chakra-ui/react";
import EditIcon from '@mui/icons-material/Edit';


interface Props {
  title?: string;
  content?: string;
  description?: string;
}

const ProfileInfoItem: React.FC<Props> = ({ title, content, description }) => {
  return (
    <>
      {
        title ? (
          <Text color={"darkgreen"}>
            {title}
          </Text>
        ) : (
          <></>
        )
      }

      {
        content ? (
          <Flex justifyContent={"space-between"}>
            <Text>
              {content}
            </Text>

            <Button
              variant={"ghost"}
              size={"sm"}
              isDisabled={true}
            >
              <EditIcon color="action" />
            </Button>
          </Flex>
        ) : (
          <></>
        )
      }

      {
        description ? (
          <Text color={"grey"}>
            {description}
          </Text>
        ) : (
          <></>
        )
      }
    </>
  );
};

export default ProfileInfoItem;