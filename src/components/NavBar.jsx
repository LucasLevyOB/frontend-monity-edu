'use client'

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
} from '@chakra-ui/react'
import { MdClose, MdMenu } from 'react-icons/md'
import Logo from '../assets/logo.png'
import { BrowserRouter as Router, Route, Link } from 'react-router-dom';
import getNavbarLinks from '../utils/getNavbarLinks';

export default function NavBar() {
  const { isOpen, onOpen, onClose } = useDisclosure()

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
                  <Menu.Item value="new-txt">New Text File</Menu.Item>
                  <Menu.Item value="new-file">New File...</Menu.Item>
                  <Menu.Item value="new-win">New Window</Menu.Item>
                  <Menu.Item value="open-file">Open File...</Menu.Item>
                  <Menu.Item value="export">Export</Menu.Item>
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
  )
}