'use client';

import { ChakraProvider, defaultSystem } from '@chakra-ui/react';
import { system } from '../../theme';


export function Provider(props) {
  return (
    <ChakraProvider value={system} theme={system} suppressHydrationWarning>
      {props.children}
    </ChakraProvider>
  );
}
