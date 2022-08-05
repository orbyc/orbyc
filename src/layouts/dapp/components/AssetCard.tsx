import {
  Box,
  Center,
  useColorModeValue,
  Heading,
  Text,
  Stack,
  Image,
  Spinner,
} from '@chakra-ui/react';
import { useFetch } from 'hooks';
import { AssetMetadata } from 'orbyc-core/pb/metadata_pb';
import { decodeHex } from 'orbyc-core/utils/encoding';
import { DataSourceContext } from 'providers/blockchain/provider';
import { useCallback } from 'react';
import { useContext } from 'react';

// const IMAGE =
//   'https://images.unsplash.com/photo-1518051870910-a46e30d9db16?ixlib=rb-1.2.1&ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&auto=format&fit=crop&w=1350&q=80';

interface AssetCardProps {
  assetId: number;
}

export default function AssetCard(props: AssetCardProps) {
  const { state } = useContext(DataSourceContext);
  const { erc245, erc423 } = state.datasource!;

  const getData = useCallback(
    async (assetId: number) => {
      const asset = await erc245.getAsset(assetId);
      const metadata = AssetMetadata.deserializeBinary(decodeHex(asset.getMetadata()));

      const issuerId = asset.getIssuer();
      const issuer = await erc423.accountInfo(issuerId);

      return { asset, metadata, issuer };
    },
    [erc245, erc423]
  );

  //   const metadataLogo = new PbImage();
  //   metadataLogo.setAttachment(`https://orbyc.github.io/dapp/orbyc.png`);
  //   metadataLogo.setName(`logo`);

  //   const metadata = new AccountMetadata();
  //   metadata.setDescription(``);
  //   metadata.setLogo(metadataLogo);
  //   metadata.setName(`Orbyc`);
  //   metadata.setLinksList([]);

  //   const metadataValue = encodeHex(metadata.serializeBinary());
  //   console.log({ metadataValue });

  const { data, loading, error } = useFetch(getData(props.assetId));
  if (error) {
    console.log({ error });
  }

  const assetImage = loading ? (
    <Box rounded={'lg'} objectFit={'cover'}>
      <Center height={230} width={282}>
        <Spinner size={`lg`} />
      </Center>
    </Box>
  ) : (
    <Image
      rounded={'lg'}
      height={230}
      width={282}
      objectFit={'cover'}
      src={data?.metadata.getBackground()?.getAttachment()}
    />
  );

  const assetContent = loading ? (
    <>Loading...</>
  ) : (
    <Stack pt={10} align={'center'}>
      <Text color={'gray.500'} fontSize={'sm'} fontWeight={800} textTransform={'uppercase'}>
        {data?.issuer.getName()}
      </Text>
      <Heading fontSize={'2xl'} fontFamily={'body'} fontWeight={800}>
        {data?.metadata.getName()}
      </Heading>
      <Stack direction={'row'} align={'center'}>
        <Text fontWeight={500} fontSize={'xl'}>
          {data?.asset.getCo2e().toString()}
        </Text>
        <Text color={'gray.600'}>Co2e</Text>
      </Stack>
    </Stack>
  );

  return (
    <Center py={12}>
      <Box
        cursor={`pointer`}
        role={'group'}
        p={6}
        maxW={'330px'}
        w={'full'}
        bg={useColorModeValue('white', 'gray.800')}
        boxShadow={'2xl'}
        rounded={'lg'}
        pos={'relative'}
        zIndex={1}
      >
        <Box
          rounded={'lg'}
          mt={-12}
          pos={'relative'}
          height={'230px'}
          _after={{
            transition: 'all .3s ease',
            content: '""',
            w: 'full',
            h: 'full',
            pos: 'absolute',
            top: 5,
            left: 0,
            // backgroundImage: `url(${data?.metadata.getBackground()?.getAttachment()})`,
            filter: 'blur(15px)',
            zIndex: -1,
          }}
          _groupHover={{
            _after: {
              filter: 'blur(20px)',
            },
          }}
        >
          {assetImage}
        </Box>
        {assetContent}
      </Box>
    </Center>
  );
}
