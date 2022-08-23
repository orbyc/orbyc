import { DragHandleIcon } from "@chakra-ui/icons";
import {
  Box,
  Button,
  Container,
  Divider,
  Flex,
  Grid,
  GridItem,
  HStack,
  Img,
  Spacer,
  Table,
  TableCaption,
  TableContainer,
  Tbody,
  Td,
  Text,
  Tfoot,
  Th,
  Thead,
  Tr,
  useBoolean,
  useColorModeValue,
} from "@chakra-ui/react";
import { useFetch } from "hooks";
import { AssetMetadata, MovementMetadata } from "orbyc-core/pb/metadata_pb";
import { decodeHex } from "orbyc-core/utils/encoding";
import { DataSourceContext } from "providers/blockchain/provider";
import { useCallback, useContext, useEffect } from "react";
import { useParams } from "react-router-dom";
import { Stat } from "./components/Stat";
import { ImagesModal } from "./components/ImagesModal";
import {
  getMovementsCarbonEmissions,
  getMovementsCountries,
  getMovementsKilometers,
  shortNumber,
  shortWeight,
} from "../helpers";
import Carousel from "react-multi-carousel";
import { ComponentCard } from "./components/ComponentCards";

export const AssetView = () => {
  const { id } = useParams();

  return (
    <Container>
      <AssetComponent id={parseInt(id!)} />
    </Container>
  );
};

const dividerProps = { mt: 7, mb: 7 };
const responsive = {
  desktop: {
    breakpoint: { max: 3000, min: 1024 },
    items: 2,
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
interface AssetProps {
  id: number;
}

interface IssuerIconProps {
  src?: string;
}

const IssuerIcon = (props: IssuerIconProps) => (
  <Box
    w={50}
    h={50}
    p={2}
    bg={useColorModeValue(`transparent`, `gray.900`)}
    borderRadius={25}
    cursor={`pointer`}
  >
    <Img src={props.src} />
  </Box>
);
export const AssetComponent = (props: AssetProps) => {
  /* CREATE STATES */
  const [showImagesModal, { off: closeImagesModal, on: openImagesModal }] =
    useBoolean(false);

  const { state } = useContext(DataSourceContext);
  const { erc245, erc423 } = state.datasource!;

  /* FETCH DATA */
  const fetchAsset = useCallback(
    async (assetId: number) => {
      const asset = await erc245.getAsset(assetId);
      const metadata = AssetMetadata.deserializeBinary(
        decodeHex(asset.getMetadata())
      );

      const issuer = await erc423.accountInfo(asset.getIssuer());

      return { asset, metadata, issuer };
    },
    [erc245, erc423]
  );

  const fetchMoves = useCallback(
    async (assetId: number) => {
      const movementIds = await erc245.getAssetTraceability(assetId);

      return await Promise.all(
        movementIds.map(async (id) => {
          const movement = await erc245.getMovement(id);
          const metadata = MovementMetadata.deserializeBinary(
            decodeHex(movement.getMetadata())
          );
          return { movement, metadata };
        })
      );
    },
    [erc245]
  );

  const fetchComposition = useCallback(
    async (assetId: number) => {
      const [compositionIds, percents] = await erc245.getAssetComposition(
        assetId
      );

      return Promise.all(
        compositionIds.map(async (id, index) => {
          const data = await fetchAsset(id);
          return { percent: percents[index], ...data };
        })
      );
    },
    [erc245, fetchAsset]
  );

  /* CALL DATA */
  const {
    data: dataAsset,
    loading: loadingAsset,
    error: errorAsset,
  } = useFetch(fetchAsset(props.id));
  useEffect(() => {
    if (errorAsset) console.log({ error: errorAsset });
  }, [errorAsset]);
  useEffect(() => {
    if (dataAsset) console.log({ dataAsset });
  }, [dataAsset]);

  const {
    data: dataMoves,
    loading: loadingMoves,
    error: errorMoves,
  } = useFetch(fetchMoves(props.id));
  useEffect(() => {
    if (errorMoves) console.log({ error: errorMoves });
  }, [errorMoves]);

  const {
    data: dataComposition,
    loading: loadingComposition,
    error: errorComposition,
  } = useFetch(fetchComposition(props.id));
  useEffect(() => {
    if (errorComposition) console.log({ error: errorComposition });
  }, [errorComposition]);

  /* USE DATA */
  const MovementsData = useCallback(
    () =>
      loadingMoves ? (
        <></>
      ) : (
        <Grid templateColumns={`repeat(3,1fr)`} gap={4}>
          <GridItem>
            <Stat
              label={`Carbon emissions`}
              value={shortWeight(
                dataAsset!.asset.getCo2e() +
                  getMovementsCarbonEmissions(dataMoves!)
              )}
            />
          </GridItem>
          <GridItem>
            <Stat
              label={`Km to deliver`}
              value={shortNumber(getMovementsKilometers(dataMoves!))}
            />
          </GridItem>
          <GridItem>
            <Stat
              label={`Countries involved`}
              value={shortNumber(getMovementsCountries(dataMoves!).length)}
            />
          </GridItem>
        </Grid>
      ),
    [loadingMoves, dataMoves, dataAsset]
  );

  const CompositionData = useCallback(
    () =>
      loadingComposition ? (
        <></>
      ) : (
        <Carousel responsive={responsive}>
          {dataComposition!.map((data) => (
            <ComponentCard {...data} />
          ))}
        </Carousel>
      ),
    [loadingComposition, dataComposition]
  );

  const PropertiesData = useCallback(
    () => (
      <TableContainer>
        <Table variant="simple">
          <TableCaption>
            All this properties are verified by{" "}
            <a href={`https://orbyc.com`} target="_blank" rel="noreferrer">
              Orbyc®
            </a>
          </TableCaption>
          <Thead>
            <Tr>
              <Th>Property</Th>
              <Th>Unit</Th>
              <Th isNumeric>Value</Th>
            </Tr>
          </Thead>
          <Tbody>
            {dataAsset?.metadata.getPropertiesList()!.map((p) => (
              <Tr key={p.getName()}>
                <Td>{p.getName()}</Td>
                <Td>millimeters (mm)</Td>
                <Td isNumeric>{p.getValue()}</Td>
              </Tr>
            ))}
          </Tbody>
          <Tfoot>
            <Tr>
              <Th>Property</Th>
              <Th>Unit</Th>
              <Th isNumeric>Value</Th>
            </Tr>
          </Tfoot>
        </Table>
      </TableContainer>
    ),
    [dataAsset]
  );

  const LinksData = useCallback(
    () => (
      <Box p={4} borderRadius={25} bgColor={`gray.900`}>
        {dataAsset?.metadata.getLinksList().map((link) => (
          <a href={link.getUrl()} target="_blank" rel="noreferrer">
            {link.getName()}
          </a>
        ))}
      </Box>
    ),
    [dataAsset]
  );

  const ImagesData = useCallback(
    () => (
      <>
        <ImagesModal
          name={dataAsset!.metadata.getName()}
          images={dataAsset!.metadata.getImagesList()}
          open={showImagesModal}
          onClose={closeImagesModal}
        />
        <Grid
          h="400px"
          templateRows="repeat(2, 1fr)"
          templateColumns="repeat(3, 1fr)"
          gap={4}
        >
          <GridItem
            rowSpan={2}
            colSpan={2}
            bgImage={dataAsset?.metadata.getImagesList()![0].getAttachment()}
            bgSize={`cover`}
          />
          <GridItem
            colSpan={1}
            bgImage={dataAsset?.metadata.getImagesList()![1].getAttachment()}
            bgSize={`cover`}
          />
          <GridItem
            colSpan={1}
            bgImage={dataAsset?.metadata.getImagesList()![2].getAttachment()}
            bgSize={`cover`}
          />
        </Grid>
        <Flex mt={`-50px`} ml={`10px`}>
          <Button
            fontSize={14}
            leftIcon={<DragHandleIcon />}
            onClick={openImagesModal}
          >
            More Images
          </Button>
        </Flex>
      </>
    ),
    [closeImagesModal, dataAsset, openImagesModal, showImagesModal]
  );

  const AssetData = useCallback(
    () =>
      loadingAsset ? (
        <Box>
          <Grid
            h="400px"
            templateRows="repeat(2, 1fr)"
            templateColumns="repeat(3, 1fr)"
            gap={4}
          >
            <GridItem rowSpan={2} colSpan={2} bg="gray.900" />
            <GridItem colSpan={1} bg="gray.900" />
            <GridItem colSpan={1} bg="gray.900" />
          </Grid>
        </Box>
      ) : (
        <Box>
          <MovementsData />
          <br />
          <ImagesData />
          <br />
          <br />
          <HStack>
            <Text fontSize="3xl" fontWeight={`black`}>
              {dataAsset?.metadata.getName()}
            </Text>
            <Spacer />
            <IssuerIcon src={dataAsset?.issuer.getLogo()?.getAttachment()} />
          </HStack>

          <br />
          <CompositionData />

          <Divider {...dividerProps} />

          <Text align={`justify`} fontWeight={`medium`}>
            Lorem ipsum dolor sit amet, consectetur adipisicing elit. Nihil vel
            omnis repellat qui nam excepturi dignissimos placeat quam, quidem
            nulla, perspiciatis commodi maxime blanditiis architecto sint
            explicabo dolorem maiores distinctio!
          </Text>

          <Divider {...dividerProps} />

          <PropertiesData />

          <br />

          <LinksData />

          <br />
        </Box>
      ),
    [
      loadingAsset,
      MovementsData,
      ImagesData,
      dataAsset,
      CompositionData,
      PropertiesData,
      LinksData,
    ]
  );

  return <AssetData />;
};
