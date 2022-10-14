/*
 * Base Google Map example
 */
import {
  Tooltip,
  Box,
  ListItem,
  UnorderedList,
  Link,
  useDisclosure,
  ModalOverlay,
  Modal,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
} from "@chakra-ui/react";
import GoogleMapReact from "google-map-react";
import React from "react";

import "./GoogleMap.scss";

const googleApiKey = process.env.REACT_APP_GOOGLE_MAPS_KEY || "";

interface ProductContent {
  locationName: string;
  co2Emissions: number;
  description: string;
}

interface ProductContentProps {
  data: ProductContent;
}

const ProductContentComponent = (props: ProductContentProps) => (
  <Box>
    <UnorderedList spacing={3}>
      <ListItem>
        <strong>Location: </strong> {props.data.locationName}
      </ListItem>
      <ListItem>
        <strong>Stakeholder role:</strong> Manufacturer
      </ListItem>
      <ListItem>
        <strong>Description:</strong> {props.data.description}
      </ListItem>
      <ListItem>
        <strong>CO2 emissions:</strong> {props.data.co2Emissions}
      </ListItem>
      {/* <ListItem>
                <strong>Environmental metrics:</strong> 100
            </ListItem>
            <ListItem>
                <strong>Social metrics:</strong> 200
            </ListItem>
            <ListItem>
                <strong>Circular economy rate:</strong> 230
            </ListItem>
            <ListItem>
                <strong>Recycle content:</strong> content
            </ListItem> */}
    </UnorderedList>
  </Box>
);

interface MapPointsProps {
  text: string;
  lat: number;
  lng: number;
  data: ProductContent;
}

const MapPoints = (props: MapPointsProps) => {
  const { isOpen, onOpen, onClose } = useDisclosure();

  return (
    <React.Fragment>
      <Tooltip
        bg="white"
        color="green"
        hasArrow
        label={<ProductContentComponent data={props.data} />}
        arrowSize={15}
      >
        <div className="pin1" data-content={props.text} onClick={onOpen} />
      </Tooltip>
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>{props.data.locationName}</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <ProductContentComponent data={props.data} />
            <Box
              margin="20px"
              display="flex"
              alignContent="center"
              justifyContent="center"
            >
              <Link color="teal.500" href="/" isExternal>
                Download certificates
              </Link>
            </Box>
          </ModalBody>
        </ModalContent>
      </Modal>
    </React.Fragment>
  );
};

export interface StakeHolder {
  lat: number;
  lng: number;
  text: string;
  data: ProductContent;
}

export interface MapCoordinates {
  lat: number;
  lng: number;
}

export interface SimpleMapPageProps {
  stakeHolders?: StakeHolder[];
  center: MapCoordinates;
}

export const SimpleMapPage = (props: SimpleMapPageProps) => {
  const defaultProps = {
    zoom: 1,
  };

  return (
    <div style={{ height: "70vh", width: "100%" }}>
      <GoogleMapReact
        bootstrapURLKeys={{ key: googleApiKey }}
        yesIWantToUseGoogleMapApiInternals
        center={props.center}
        defaultZoom={defaultProps.zoom}
      >
        {props.stakeHolders && props.stakeHolders.length > 0
          ? props.stakeHolders.map((stakeHolder, index) => {
              return (
                <MapPoints
                  key={index}
                  lat={stakeHolder.lat}
                  lng={stakeHolder.lng}
                  text={stakeHolder.text}
                  data={stakeHolder.data}
                />
              );
            })
          : null}
      </GoogleMapReact>
    </div>
  );
};
