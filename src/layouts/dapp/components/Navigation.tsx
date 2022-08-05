import {
  Box,
  Flex,
  Button,
  Menu,
  MenuList,
  MenuItem,
  Stack,
  useColorMode,
  MenuButton,
  Icon,
  Image,
  useColorModeValue,
} from '@chakra-ui/react';
import {
  MoonIcon,
  SunIcon,
  HamburgerIcon,
  InfoOutlineIcon,
  QuestionOutlineIcon,
} from '@chakra-ui/icons';
import { BsBook, BsGlobe2, BsFileEarmarkText } from 'react-icons/bs';
import { useCallback, useContext } from 'react';
import { DataSourceContext } from 'providers/blockchain/provider';
import { MetaMaskProvider } from 'metamask-react';
import { ConnectWalletButton } from './ConnectWallet';
import { ConnectedWallet } from './ConnectedWallet';

export function Navigation() {
  const { colorMode, toggleColorMode } = useColorMode();
  const { state } = useContext(DataSourceContext);

  const WalletButton = useCallback(
    () =>
      state.datasource ? (
        <ConnectedWallet />
      ) : (
        <MetaMaskProvider>
          <ConnectWalletButton />
        </MetaMaskProvider>
      ),
    [state.datasource]
  );

  const MenuItemTheme = useCallback(
    () =>
      colorMode === 'light' ? (
        <MenuItem onClick={toggleColorMode} icon={<MoonIcon />}>
          Dark Theme
        </MenuItem>
      ) : (
        <MenuItem onClick={toggleColorMode} icon={<SunIcon />}>
          Light Theme
        </MenuItem>
      ),
    [colorMode, toggleColorMode]
  );

  return (
    <Box px={4}>
      <Flex h={16} alignItems={'center'} justifyContent={'space-between'}>
        <Box
          w={45}
          h={45}
          p={2.5}
          cursor="pointer"
          bg={useColorModeValue('gray.100', 'gray.900')}
          borderRadius={50}
        >
          <Image src={`https://orbyc.github.io/dapp/orbyc.png`} />
        </Box>

        <Flex alignItems={'center'}>
          <Stack direction={'row'} spacing={3}>
            <WalletButton />
            <Menu isLazy closeOnSelect={false}>
              <MenuButton as={Button} minW={0}>
                <HamburgerIcon />
              </MenuButton>
              <MenuList alignItems={'center'}>
                <MenuItem icon={<InfoOutlineIcon />}>About</MenuItem>
                <MenuItem icon={<QuestionOutlineIcon />}>Help Center</MenuItem>
                <MenuItem icon={<Icon as={BsGlobe2} />}>Language</MenuItem>
                <MenuItemTheme />
                <MenuItem icon={<Icon as={BsBook} />}>Docs</MenuItem>
                <MenuItem icon={<Icon as={BsFileEarmarkText} />}>Legal {'&'} Privacy</MenuItem>
              </MenuList>
            </Menu>
          </Stack>
        </Flex>
      </Flex>
    </Box>
  );
}
