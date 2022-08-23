import {
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
} from "@chakra-ui/react";
import React from "react";

export function FormModal(props: FormModalProps) {
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
