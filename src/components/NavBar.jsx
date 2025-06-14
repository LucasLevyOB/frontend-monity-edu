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
} from '@chakra-ui/react';
import { MdClose, MdMenu } from 'react-icons/md';
import Logo from '../assets/logo.png';
import { BrowserRouter as Router, Route, Link } from 'react-router-dom';
import getNavbarLinks from '../utils/getNavbarLinks';
import useNavbarUserOptions from '../hooks/useNavbarUserOptions';

export default function NavBar() {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { getUserOptions } = useNavbarUserOptions();

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
          <HStack as={'nav'} spacing={4} display={{ base: 'none', md: 'flex' }}>
            {getNavbarLinks(true).map((link) => (
              <Link key={link.to} to={link.to}>{link.text}</Link>
            ))}
          </HStack>
        </HStack>
        <Flex alignItems={'center'}>
          <Menu.Root>
            <Menu.Trigger asChild>
              <Box>
                <Avatar.Root>
                  <Avatar.Fallback name="Segun Adebayo" />
                </Avatar.Root>
              </Box>
            </Menu.Trigger>
            <Portal>
              <Menu.Positioner>
                <Menu.Content>
                  {getUserOptions("monitor").map(option => (
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
          <Stack as={'nav'} spacing={4}>
            {getNavbarLinks(true).map((link) => (
              <NavLink key={link}>{link}</NavLink>
            ))}
          </Stack>
        </Box>
      ) : null}
    </Box>
  );
}