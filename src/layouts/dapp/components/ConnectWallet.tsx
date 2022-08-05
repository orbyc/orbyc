import {
  // Link,
  Button,
  Spinner,
} from '@chakra-ui/react';
import { useContext, useEffect } from 'react';
import { addDataSource, DataSourceContext, removeDataSource } from 'providers/blockchain/provider';
import { useMetaMask } from 'metamask-react';
import { EthersDataSource } from 'providers/blockchain/datasource';
import { ethers } from 'ethers';

// const NavLink = ({ children }: { children: ReactNode }) => (
//   <Link
//     px={2}
//     py={1}
//     rounded={'md'}
//     _hover={{
//       textDecoration: 'none',
//       bg: useColorModeValue('gray.200', 'gray.700'),
//     }}
//     href={'#'}
//   >
//     {children}
//   </Link>
// );
export function ConnectWalletButton(): JSX.Element {
  const { status, connect, ethereum } = useMetaMask();
  const { dispatch } = useContext(DataSourceContext);

  useEffect(() => {
    if (status === 'connected') {
      dispatch(
        addDataSource(
          EthersDataSource(
            new ethers.providers.Web3Provider(ethereum),
            '0xd7dB90F36cACb1e06C5473414C91a7E5F64D63cd'
          )
        )
      );
    } else {
      dispatch(removeDataSource());
    }
  }, [status, ethereum, dispatch]);

  if (status === 'unavailable')
    return (
      <Button>
        <a href="https://metamask.io/download/" target="_blank" rel="noreferrer">
          Install Metamask
        </a>
      </Button>
    );

  if (status === 'notConnected') return <Button onClick={connect}>Connect Wallet</Button>;

  return (
    <Button>
      <Spinner />
    </Button>
  );
}
