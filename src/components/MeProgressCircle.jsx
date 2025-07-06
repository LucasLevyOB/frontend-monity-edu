import { ProgressCircle } from "@chakra-ui/react";

const MeProgressCircle = () => {
  return (
    <ProgressCircle.Root value={null} size="sm">
      <ProgressCircle.Circle>
        <ProgressCircle.Track />
        <ProgressCircle.Range />
      </ProgressCircle.Circle>
    </ProgressCircle.Root>
  );
};

export default MeProgressCircle;