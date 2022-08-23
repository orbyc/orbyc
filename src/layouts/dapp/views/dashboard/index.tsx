import { SearchIcon } from "@chakra-ui/icons";
import {
  Box,
  Center,
  Container,
  Heading,
  HStack,
  IconButton,
  Input,
  InputGroup,
  InputLeftElement,
  Tooltip,
  useColorModeValue,
} from "@chakra-ui/react";
import { useCallback, useState } from "react";
import Carousel from "react-multi-carousel";
import { useNavigate } from "react-router-dom";
import AssetCard from "./components/AssetCard";
import { responsive } from "../helpers";
import { FormModal } from "layouts/dapp/forms/ModalForm";
import { AssetForm } from "layouts/dapp/forms/AssetForm";
import { CertificateForm } from "layouts/dapp/forms/CertificateForm";
import { MovementForm } from "layouts/dapp/forms/MovementForm";
import { MdFeed, MdOutlineVerified, MdTimeline } from "react-icons/md";

type IssueForm = "ASSET" | "CERTIFICATE" | "MOVEMENT" | "NONE";

const Divider = () => <Box mt={100}></Box>;

const circularEconomy = [188989, 1849];
const sponsored = [1849, 1849, 1849];

export const Home = () => {
  const navigate = useNavigate();

  const handleSubmit = useCallback(
    (e: any) => {
      if (e.code === "Enter") navigate(`/dapp/${e.target.value}`);
    },
    [navigate]
  );

  const [form, setForm] = useState<IssueForm>("NONE");
  const openForm = useCallback(
    (form: IssueForm) => () => setForm(form),
    [setForm]
  );
  const closeForm = useCallback(() => setForm("NONE"), [setForm]);

  const IssueButtons = useCallback(
    () => (
      <HStack ml={3}>
        {/* ISSUE ASSET */}
        <FormModal
          title={`Issue Asset`}
          open={form === "ASSET"}
          handleClose={closeForm}
        >
          <AssetForm />
        </FormModal>
        <Tooltip label={`Issue Asset`}>
          <IconButton
            onClick={openForm(`ASSET`)}
            aria-label="Issue Asset"
            borderRadius={20}
            fontSize="20px"
          >
            <MdFeed />
          </IconButton>
        </Tooltip>
        {/* ISSUE CERTIFICATE */}
        <FormModal
          title={`Issue Certificate`}
          open={form === "CERTIFICATE"}
          handleClose={closeForm}
        >
          <CertificateForm />
        </FormModal>
        <Tooltip label={`Issue Certificate`}>
          <IconButton
            onClick={openForm(`CERTIFICATE`)}
            aria-label="Issue Certificate"
            borderRadius={20}
            fontSize="20px"
          >
            <MdOutlineVerified />
          </IconButton>
        </Tooltip>
        {/* ISSUE MOVEMENT */}
        <FormModal
          title={`Issue Movement`}
          open={form === "MOVEMENT"}
          handleClose={closeForm}
        >
          <MovementForm />
        </FormModal>
        <Tooltip label={`Issue Movement`}>
          <IconButton
            onClick={openForm(`MOVEMENT`)}
            aria-label="Issue Movement"
            borderRadius={20}
            fontSize="20px"
          >
            <MdTimeline />
          </IconButton>
        </Tooltip>
      </HStack>
    ),
    [closeForm, form, openForm]
  );

  return (
    <>
      <Container maxW="8xl">
        <Center>
          <Box width={600} p={20}>
            <InputGroup>
              <InputLeftElement
                pointerEvents="none"
                children={
                  <SearchIcon
                    color={useColorModeValue("gray.500", "gray.300")}
                  />
                }
              />
              <Input
                type="number"
                fontWeight={`semibold`}
                placeholder="Identifier number"
                variant={`contained`}
                onKeyDown={handleSubmit}
                bgColor={useColorModeValue("gray.100", "gray.900")}
                borderRadius={20}
              />
              <IssueButtons />
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
