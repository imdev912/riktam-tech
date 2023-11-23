import {
  Text,
  Flex,
} from "@chakra-ui/react";


interface Props {
  title?: string;
  content?: string;
  description?: string;
}

const ProfileItem: React.FC<Props> = ({ title, content, description }) => {
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

export default ProfileItem;