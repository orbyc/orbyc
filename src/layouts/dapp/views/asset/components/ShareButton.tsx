import {
  Center, IconButton, Modal,
  ModalBody,
  ModalContent,
  ModalOverlay, useBoolean,
  useColorModeValue
} from "@chakra-ui/react";
import { MdQrCode } from "react-icons/md";
import { OrbycQrCode } from "./OrbycQrCode";

interface ShareButtonProps {
  assetId: number;
}
export function ShareButton(props: ShareButtonProps) {
  const [isOpen, { on, off }] = useBoolean(false);
  return (
    <>
      <Modal isOpen={isOpen} onClose={off}>
        <ModalOverlay />
        <ModalContent borderRadius={40} bgColor={`white`}>
          <ModalBody>
            <Center>
              <OrbycQrCode assetId={props.assetId} />
            </Center>
          </ModalBody>
        </ModalContent>
      </Modal>
      <IconButton
        aria-label="share asset"
        borderRadius={25}
        fontSize="30px"
        w={50}
        h={50}
        onClick={on}
        bgColor={useColorModeValue(`transparent`, `gray.900`)}
      >
        <MdQrCode />
      </IconButton>
    </>
  );
}
