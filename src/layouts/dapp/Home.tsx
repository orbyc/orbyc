import { SearchIcon } from '@chakra-ui/icons';
import {
  Box,
  Center,
  Container,
  Heading,
  Input,
  InputGroup,
  InputLeftElement,
} from '@chakra-ui/react';
import Carousel from 'react-multi-carousel';
import AssetCard from './components/AssetCard';

const Divider = () => <Box mt={100}></Box>;

const circularEconomy = [1849, 1849, 1849, 1849, 1849];
const sponsored = [1849, 1849, 1849];

export const Home = () => {
  return (
    <>
      {/* <Center> */}
      <Container maxW="8xl">
        <Center>
          <Box width={600} p={20}>
            <InputGroup>
              <InputLeftElement pointerEvents="none" children={<SearchIcon color="gray.300" />} />
              <Input type="number" placeholder="Search" variant={`contained`} />
            </InputGroup>
          </Box>
        </Center>

        <Center p={5}>
          <Heading as="h4" size="lg">
            Circular economy products
          </Heading>
        </Center>
        <Carousel responsive={responsive} removeArrowOnDeviceType={['tablet', 'mobile']}>
          {circularEconomy.map((e, key) => (
            <AssetCard assetId={e} key={key} />
          ))}
        </Carousel>

        <Divider />

        <Center p={5}>
          <Heading as="h4" size="lg">
            From our sponsored
          </Heading>
        </Center>
        <Carousel responsive={responsive} removeArrowOnDeviceType={['tablet', 'mobile']}>
          {sponsored.map((e, key) => (
            <AssetCard assetId={e} key={key} />
          ))}
        </Carousel>
      </Container>
      <Divider />
    </>
  );
};

const responsive = {
  desktop: {
    breakpoint: { max: 3000, min: 1024 },
    items: 3,
    slidesToSlide: 1, // optional, default to 1.
  },
  tablet: {
    breakpoint: { max: 1024, min: 464 },
    items: 2,
    slidesToSlide: 1, // optional, default to 1.
  },
  mobile: {
    breakpoint: { max: 464, min: 0 },
    items: 1,
    slidesToSlide: 1, // optional, default to 1.
  },
};
