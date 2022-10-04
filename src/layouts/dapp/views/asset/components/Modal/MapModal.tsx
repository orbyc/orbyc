import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
} from '@chakra-ui/react'
import { useFetch } from 'hooks';
import { shortWeight } from 'layouts/dapp/views/helpers';
import { Asset, Movement } from 'orbyc-core/pb/domain_pb';
import { AccountMetadata, AssetMetadata, MovementMetadata } from 'orbyc-core/pb/metadata_pb';
import { useEffect, useState } from 'react';
import { getCoordinates } from './GoogleApi';
import { SimpleMapPage, StakeHolder, MapCoordinates } from './GoogleMap';

interface Props {
  isOpen: boolean;
  childComp?: JSX.Element;
  text?: string;
  title?: string;
  onAccept?: () => void;
  onClose: () => void;
  assetId?: number;
  dataAsset: {
    asset: Asset;
    metadata: AssetMetadata;
    issuer: AccountMetadata;
  };
  movements: {
    movement: Movement;
    metadata: MovementMetadata;
  }[]
}

export const MapModal = (props: Props) => {

  // Stakeholder list
  const [stakeHolder, setStakeHolder] = useState<StakeHolder[]>([])
  // Map center coordinates
  const [center, setCenter] = useState<MapCoordinates>({lat: 0, lng: 0})

  const {
    data: coordinates,
    loading: loadingCoordinates,
    error: errorCoordinates,
  } = useFetch(getCoordinates(props.dataAsset.metadata.getCreation()?.getLocation()! as string));

  useEffect(() => {
    if (!loadingCoordinates) {

      // Add the movement information here
      setStakeHolder([
        {
          ...coordinates.results[0].geometry.location,
          text: '1',
          data: {
            locationName: coordinates.results[0].formatted_address,
            co2Emissions: shortWeight(
              props.dataAsset!.asset.getCo2e() 
            ),
            description:  props.dataAsset!.metadata.getDescription()
          }
        }
      ])
      setCenter({...coordinates.results[0].geometry.location})
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [coordinates, loadingCoordinates])

  return (
    <Modal isOpen={props.isOpen} onClose={props.onClose} size={'full'}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader color='green'>Traceability map</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <SimpleMapPage stakeHolders={stakeHolder} center={center}/>
        </ModalBody>
      </ModalContent>
    </Modal>
  )
}