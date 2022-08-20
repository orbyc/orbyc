import {
  Box,
  Grid,
  GridItem,
  Text,
  useColorModeValue,
  VStack,
} from "@chakra-ui/react";
import { AssetMetadata } from "orbyc-core/pb/metadata_pb";
import { Link } from "react-router-dom";
import { Asset } from "orbyc-core/pb/domain_pb";
import { shortWeight } from "../views/utils";

interface ComponentCardsProps {
  asset: Asset;
  metadata: AssetMetadata;
  percent: number;
}
export function ComponentCard(props: ComponentCardsProps): JSX.Element {
  return (
    <Link to={`/dapp/${props.asset.getId()}`}>
      <Box
        p={3}
        ml={3}
        mr={3}
        borderRadius={10}
        bgColor={useColorModeValue(`gray.100`, `gray.900`)}
      >
        <Grid templateColumns="repeat(3, 1fr)">
          <GridItem>
            <Box
              bgImage={props.metadata.getBackground()?.getAttachment()}
              bgSize={`cover`}
              w={20}
              h={20}
              borderRadius={10}
            />
          </GridItem>
          <GridItem colSpan={2}>
            <VStack>
              <Text fontSize={`md`} as={`b`}>
                {props.metadata.getName()}
              </Text>

              <Text fontSize={`sm`} fontWeight={`thin`}>
                {props.percent}%
              </Text>
              <Text fontSize={`sm`} fontWeight={`semibold`}>
                {shortWeight(props.asset.getId())} Co2e
              </Text>
            </VStack>
          </GridItem>
        </Grid>
      </Box>
    </Link>
  );
}
