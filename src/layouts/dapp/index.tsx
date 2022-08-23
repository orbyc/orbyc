import { ChakraProvider, extendTheme } from "@chakra-ui/react";
import {
  DataSourceContext,
  DataSourceProvider,
} from "providers/blockchain/provider";
import { useContext } from "react";
import { Outlet } from "react-router-dom";
import { Navigation } from "./components/Navigation";
import { ConnectWallet } from "./views/home";
import { StepsStyleConfig as Steps } from "chakra-ui-steps";

const theme = extendTheme({
  components: {
    Steps,
  },
});
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
