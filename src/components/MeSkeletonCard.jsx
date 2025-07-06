import { Box, HStack, Skeleton, SkeletonCircle, SkeletonText, Stack } from "@chakra-ui/react";

const MeSkeletonCard = (props) => {
  return (
    <Box w="340px" {...props}>
      <Box paddingX={6} pt={6}>
        <SkeletonText noOfLines={1} w="196px" m="auto" />
      </Box>
      <Box p={6}>
        <SkeletonText noOfLines={4} />
        <HStack justifyContent="space-between" mt={6}>
          <Skeleton height="18px" width="140px" />
          <Skeleton height="18px" width="52px" />
        </HStack>
      </Box>
      <HStack justifyContent="flex-end" paddingX={6} pb={6}>
        <Skeleton height="40px" width="94px" />
        <Skeleton height="40px" width="94px" />
      </HStack>
    </Box>
  );
};

export default MeSkeletonCard;