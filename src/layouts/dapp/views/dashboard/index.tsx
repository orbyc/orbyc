import { SearchIcon, SpinnerIcon } from "@chakra-ui/icons";
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
  Spinner,
  Text,
  Tooltip,
  useColorModeValue,
} from "@chakra-ui/react";
import { useCallback, useContext, useEffect, useState } from "react";
import Carousel from "react-multi-carousel";
import { useNavigate } from "react-router-dom";
import AssetCard from "./components/AssetCard";
import { responsive } from "../helpers";
import { FormModal } from "layouts/dapp/forms/ModalForm";
import { AssetForm } from "layouts/dapp/forms/AssetForm";
import { CertificateForm } from "layouts/dapp/forms/CertificateForm";
import { MovementForm } from "layouts/dapp/forms/MovementForm";
import {
  MdDownload,
  MdFeed,
  MdOutlineVerified,
  MdTimeline,
} from "react-icons/md";
import { useDropzone } from "react-dropzone";
import Excel from "exceljs";
import { ExplorerNetwork, OrbycAddress } from "data";
import { DataSourceContext } from "providers/blockchain/provider";
import { useFetch } from "hooks";

type IssueForm = "ASSET" | "CERTIFICATE" | "MOVEMENT" | "NONE";

const Divider = () => <Box mt={100}></Box>;

const circularEconomy: number[] = [];
const sponsored: number[] = [];

const DZone = () => {
  const {
    getRootProps,
    getInputProps,
    isDragActive,
    isDragAccept,
    isDragReject,

    acceptedFiles,
  } = useDropzone({
    accept: {
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet": [
        ".xls",
        ".xlsx",
      ],
      "application/vnd.ms-excel": [".xls", ".xlsx"],
    },
  });

  useEffect(() => {
    for (const file of acceptedFiles) {
      const workbook = new Excel.Workbook();
      workbook.xlsx.read(file.stream()).then((f) => {});
    }
  }, [acceptedFiles]);

  return (
    <div className="container">
      <Box
        {...getRootProps({ className: "dropzone" })}
        padding={10}
        bgColor={useColorModeValue("gray.100", "gray.900")}
        borderRadius={25}
      >
        <input {...getInputProps()} />
        {isDragAccept && <p>All files will be accepted</p>}
        {isDragReject && <p>Some files will be rejected</p>}
        {!isDragActive && <p>Drop some files here ...</p>}
      </Box>
    </div>
  );
};

export const Home = () => {
  const navigate = useNavigate();

  const { state } = useContext(DataSourceContext);
  const { erc423, utils } = state.datasource!;

  const getAccount = useCallback(async () => {
    const agent = await utils.currentAccount();
    return await erc423.accountOf(agent);
  }, [erc423, utils]);

  const { data: account, loading: loadingAccount } = useFetch(getAccount());

  const handleSubmit = useCallback(
    (e: any) => {
      if (e.code === "Enter") navigate(`/browser/${e.target.value}`);
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
        {/* DOWNLOAD ASSETS LIST */}
        <Tooltip label={`Download Assets List`}>
          <a
            href={`${ExplorerNetwork}/exportData?type=tokentxns-nft&contract=${OrbycAddress}&a=${account}&decimal=0`}
            target="_blank"
            rel="noreferrer"
          >
            <IconButton
              aria-label="Download Assets List"
              borderRadius={20}
              fontSize="20px"
            >
              {loadingAccount ? <Spinner /> : <MdDownload />}
            </IconButton>
          </a>
        </Tooltip>
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
    [closeForm, form, openForm, loadingAccount, account]
  );

  return (
    <>
      <Container maxW="8xl">
        <Divider />
        <Center>
          <Box
            width={320}
            height={110}
            bgImage={`/name.png`}
            bgSize={`cover`}
          />
          <Text marginTop={50} fontWeight="bold" color={`#0B785A`}>
            Explorer
          </Text>
        </Center>
        <br />

        <Center>
          <Box width={600}>
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

        {/* <Divider />

        <Center>
          <DZone />
        </Center> */}

        <Divider />

        <Center p={5}>
          <Heading as="h4" size="lg" fontWeight={200}>
            Verified circular economy products
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
            Verified sponsored products
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
