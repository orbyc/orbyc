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
          new ethers.providers.JsonRpcProvider(
            `https://goerli.infura.io/v3/1e11387af97e45669280bcb33254891e`
          ),
          "0x103e864f1BFedeACd63b09874A228a7131316466"
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
