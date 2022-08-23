import {
  Button,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
} from "@chakra-ui/react";
import React, { useEffect } from "react";

export function FormModal(props: FormModalProps) {
  useEffect(() => {
    console.log({ open: props.open });
  }, [props.open]);

  return (
    <Modal isOpen={props.open} onClose={props.handleClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>{props.title}</ModalHeader>
        <ModalCloseButton />
        <ModalBody>{props.children}</ModalBody>

        <ModalFooter></ModalFooter>
      </ModalContent>
    </Modal>
  );
}
interface FormModalProps {
  open: boolean;
  title: string;
  handleClose: () => void;
  children?: React.ReactNode;
}
