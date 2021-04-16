import { Button } from "@chakra-ui/button";
import { useDisclosure } from "@chakra-ui/hooks";
import {
  AlertDialog,
  AlertDialogBody,
  AlertDialogCloseButton,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogOverlay,
} from "@chakra-ui/modal";
import React, { ReactElement, useCallback, useImperativeHandle } from "react";

export interface ConfirmDeleteProps {
  onConfirm: () => void;
}

function ConfirmDelete(
  { onConfirm }: ConfirmDeleteProps,
  ref: any
): ReactElement {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const cancelRef = React.useRef<any>();

  useImperativeHandle(ref, () => ({
    show: onOpen,
    hide: onClose,
  }));

  const onConfirmHandler = useCallback(() => {
    onClose();
    onConfirm();
  }, [onClose, onConfirm]);

  return (
    <>
      <AlertDialog
        motionPreset="slideInBottom"
        leastDestructiveRef={cancelRef}
        onClose={onClose}
        isOpen={isOpen}
        isCentered
      >
        <AlertDialogOverlay />

        <AlertDialogContent>
          <AlertDialogHeader>Are you sure 'bout that?</AlertDialogHeader>
          <AlertDialogCloseButton />
          <AlertDialogBody>
            <img
              src="https://media.giphy.com/media/IfyjWLQMeF6kbG2r0z/giphy.gif"
              style={{ maxWidth: "100%" }}
            />
            Opravdu chcete smazat rezervaci? Tato operace neni vratna.
          </AlertDialogBody>
          <AlertDialogFooter>
            <Button ref={cancelRef} onClick={onClose}>
              No
            </Button>
            <Button colorScheme="red" ml={3} onClick={onConfirmHandler}>
              Yes
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}

export default React.forwardRef(ConfirmDelete);
