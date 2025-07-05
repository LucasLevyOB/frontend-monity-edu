'use client';

import {
  Box,
  Flex,
  Avatar,
  HStack,
  Text,
  IconButton,
  Button,
  Menu,
  useDisclosure,
  Stack,
  Portal,
  Icon,
  Image,
  VStack,
} from '@chakra-ui/react';
import { MdClose, MdMenu } from 'react-icons/md';
import Logo from '../assets/logo.png';
import { BrowserRouter as Router, Route, Link } from 'react-router-dom';
import getNavbarLinks from '../utils/getNavbarLinks';
import useNavbarUserOptions from '../hooks/useNavbarUserOptions';
import { store } from "../stores";

export default function NavBar() {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { getUserOptions } = useNavbarUserOptions();
  const userType = store.getState().auth.user?.userType || "ALUNO";
  const userName = store.getState().auth.user?.nome || "Usuário";
  const email = store.getState().auth.user?.email || "usuario@gmail.com";

  return (
    <Box px={8} py={3} shadow="sm">
      <Flex h={16} alignItems={'center'} justifyContent={'space-between'}>
        <IconButton
          size={'md'}
          icon={isOpen ? <MdClose /> : <MdMenu />}
          aria-label={'Open Menu'}
          display={{ md: 'none' }}
          onClick={isOpen ? onClose : onOpen}
        />
        <HStack spacing={8} alignItems={'center'}>
          <Box mr={32}>
            <Image src={Logo} height="48px" />
          </Box>
          <HStack as={'nav'} spaceX={6} display={{ base: 'none', md: 'flex' }}>
            {getNavbarLinks(userType).map((link) => (
              <Link key={link.to} to={link.to}>{link.text}</Link>
            ))}
          </HStack>
        </HStack>
        <Flex alignItems={'center'}>
          <Menu.Root>
            <Menu.Trigger asChild>
              <Box>
                <Avatar.Root>
                  <Avatar.Fallback name={userName} />
                </Avatar.Root>
              </Box>
            </Menu.Trigger>
            <Portal>
              <Menu.Positioner>
                <Menu.Content>
                  <VStack padding={2}>
                    <Avatar.Root mb={1}>
                      <Avatar.Fallback name={userName} />
                    </Avatar.Root>
                    <Text>{email}</Text>
                  </VStack>
                  <Menu.Separator />
                  {getUserOptions(userType).map(option => (
                    <Menu.Item value={option.text} key={option.text} onClick={option.action}>{option.text}</Menu.Item>
                  ))}
                </Menu.Content>
              </Menu.Positioner>
            </Portal>
          </Menu.Root>
        </Flex>
      </Flex>

      {isOpen ? (
        <Box pb={4} display={{ md: 'none' }}>
          <Stack as={'nav'} spaceY={6}>
            {getNavbarLinks(userType).map((link) => (
              <NavLink key={link}>{link}</NavLink>
            ))}
          </Stack>
        </Box>
      ) : null}
    </Box>
  );
}