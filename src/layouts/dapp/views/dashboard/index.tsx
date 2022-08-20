import { SearchIcon } from "@chakra-ui/icons";
import {
  Box,
  Center,
  Container,
  Heading,
  Input,
  InputGroup,
  InputLeftElement,
} from "@chakra-ui/react";
import { useCallback } from "react";
import Carousel from "react-multi-carousel";
import { useNavigate } from "react-router-dom";
import AssetCard from "./components/AssetCard";
import { responsive } from "../utils";

const Divider = () => <Box mt={100}></Box>;

const circularEconomy = [1849, 1849, 1849, 1849, 1849];
const sponsored = [1849, 1849, 1849];

export const Home = () => {
  const navigate = useNavigate();

  const handleSubmit = useCallback(
    (e: any) => {
      if (e.code === "Enter") navigate(`/dapp/${e.target.value}`);
    },
    [navigate]
  );

  return (
    <>
      {/* <Center> */}
      <Container maxW="8xl">
        <Center>
          <Box width={600} p={20}>
            <InputGroup>
              <InputLeftElement
                pointerEvents="none"
                children={<SearchIcon color="gray.300" />}
              />
              <Input
                type="number"
                placeholder="Search"
                variant={`contained`}
                onKeyDown={handleSubmit}
              />
            </InputGroup>
          </Box>
        </Center>

        <Center p={5}>
          <Heading as="h4" size="lg" fontWeight={200}>
            Circular economy products
          </Heading>
        </Center>
        <Carousel
          responsive={responsive}
          removeArrowOnDeviceType={["tablet", "mobile"]}
        >
          {circularEconomy.map((e, key) => (
            <AssetCard assetId={e} key={key} />
          ))}
        </Carousel>

        <Divider />

        <Center p={5}>
          <Heading as="h4" size="lg" fontWeight={200}>
            From our sponsored
          </Heading>
        </Center>
        <Carousel
          responsive={responsive}
          removeArrowOnDeviceType={["tablet", "mobile"]}
        >
          {sponsored.map((e, key) => (
            <AssetCard assetId={e} key={key} />
          ))}
        </Carousel>
      </Container>
      <Divider />
    </>
  );
};
