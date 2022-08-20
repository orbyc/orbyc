import { Box, Text, useColorModeValue, VStack } from '@chakra-ui/react';

interface StatProps {
  label: string;
  value: string;
}
export const Stat = (props: StatProps) => (
  <Box
    bgColor={useColorModeValue(`gray.100`, `gray.900`)}
    p={5}
    borderRadius={10}
    cursor={`pointer`}
    h={`100%`}
  >
    <VStack textAlign={`center`}>
      <Text fontSize={`2xl`} fontWeight={`semibold`} as={`p`}>
        {props.value}
      </Text>

      <Text fontSize={`x-small`} fontWeight={`bold`} maxW={70} textAlign={`inherit`}>
        {props.label}
      </Text>
    </VStack>
  </Box>
);
