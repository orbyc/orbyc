import {
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
} from "@chakra-ui/react";
import { Image } from "orbyc-core/pb/metadata_pb";
import { useCallback } from "react";
import ImageGallery, { ReactImageGalleryItem } from "react-image-gallery";

interface ImagesModalProps {
  name: string;
  images: Image[];
  open: boolean;
  onClose: () => void;
}
export const ImagesModal = (props: ImagesModalProps) => {
  const getItem = useCallback(
    (e: Image): ReactImageGalleryItem => ({
      original: e.getAttachment(),
      description: e.getName(),
    }),
    []
  );

  return (
    <Modal onClose={props.onClose} isOpen={props.open} size={`full`}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>{props.name}</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <ImageGallery
            items={props.images.map((e) => getItem(e))}
            lazyLoad
            showBullets
            showNav
            showThumbnails
          />
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};
