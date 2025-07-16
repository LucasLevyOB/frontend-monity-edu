import { ProgressCircle } from "@chakra-ui/react";

const MeProgressCircle = ({ size, circleCss, ...restProps }) => {
  return (
    <ProgressCircle.Root value={null} size={size ? size : "sm"} {...restProps}>
      <ProgressCircle.Circle css={circleCss}>
        <ProgressCircle.Track />
        <ProgressCircle.Range />
      </ProgressCircle.Circle>
    </ProgressCircle.Root>
  );
};

export default MeProgressCircle;