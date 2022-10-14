import {
  addDataSource,
  removeDataSource,
  DataSourceContext,
  DataSourceProvider,
} from "providers/blockchain/provider";
import { useContext, useEffect } from "react";
import { Outlet, useParams } from "react-router-dom";
import { EthersDataSource } from "providers/blockchain/datasource";
import { ethers } from "ethers";
import {
  Box,
  ChakraProvider,
  Container,
  Spinner,
  theme,
} from "@chakra-ui/react";
import { AssetComponent } from "layouts/dapp/views/asset";
import { InfuraNetwork, OrbycAddress } from "data";

export const ExplorerLayout = () => {
  return (
    <ChakraProvider theme={theme}>
      <DataSourceProvider>
        <Container>
          <ExplorerView />
        </Container>
      </DataSourceProvider>
    </ChakraProvider>
  );
};

const ExplorerView = () => {
  const { state, dispatch } = useContext(DataSourceContext);

  useEffect(() => {
    dispatch(
      addDataSource(
        EthersDataSource(
          new ethers.providers.JsonRpcProvider(InfuraNetwork),
          OrbycAddress
        )
      )
    );

    return () => {
      dispatch(removeDataSource());
    };
  }, [dispatch]);

  if (!state.datasource) {
    return <Spinner />;
  }

  return <Outlet />;
};

export const AssetExplorerView = () => {
  const { id } = useParams();

  return (
    <Box mt={30}>
      <AssetComponent id={parseInt(id!)} />
    </Box>
  );
};
