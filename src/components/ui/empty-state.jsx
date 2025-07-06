import { EmptyState as ChakraEmptyState, VStack, Image } from '@chakra-ui/react';
import * as React from 'react';

export const EmptyState = React.forwardRef(function EmptyState(props, ref) {
  const { title, description, image, icon, children, ...rest } = props;
  return (
    <ChakraEmptyState.Root ref={ref} {...rest} paddingBlock={9}>
      <ChakraEmptyState.Content>
        {icon && (
          <ChakraEmptyState.Indicator>{icon}</ChakraEmptyState.Indicator>
        )}
        {image && (
          <ChakraEmptyState.Indicator>
            <Image src={image} />
          </ChakraEmptyState.Indicator>
        )}
        {description ? (
          <VStack textAlign='center'>
            <ChakraEmptyState.Title>{title}</ChakraEmptyState.Title>
            <ChakraEmptyState.Description>
              {description}
            </ChakraEmptyState.Description>
          </VStack>
        ) : (
          <ChakraEmptyState.Title>{title}</ChakraEmptyState.Title>
        )}
        {children}
      </ChakraEmptyState.Content>
    </ChakraEmptyState.Root>
  );
});
