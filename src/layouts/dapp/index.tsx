import { ChakraProvider, theme } from '@chakra-ui/react';
import { DataSourceContext, DataSourceProvider } from 'providers/blockchain/provider';
import { useContext } from 'react';
import { Outlet } from 'react-router-dom';
import { Navigation } from './components/Navigation';
import { ConnectWallet } from './views/home';

export const DappLayout = () => (
  <ChakraProvider theme={theme}>
    <DataSourceProvider>
      <Navigation />
      <Body />
    </DataSourceProvider>
  </ChakraProvider>
);

const Body = () => {
  const { state } = useContext(DataSourceContext);

  if (state.datasource) {
    return <Outlet />;
  }

  return <ConnectWallet />;
};
