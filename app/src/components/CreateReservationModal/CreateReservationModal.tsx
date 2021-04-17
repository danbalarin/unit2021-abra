import { Button } from "@chakra-ui/button";
import {
  FormControl,
  FormErrorMessage,
  FormLabel,
} from "@chakra-ui/form-control";
import { useDisclosure } from "@chakra-ui/hooks";
import { Input } from "@chakra-ui/input";
import {
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
} from "@chakra-ui/modal";
import { useFormik } from "formik";
import React, { ReactElement, useImperativeHandle } from "react";

import {
  CreateReservationPayload,
  createReservationValidationSchema,
} from "models/CreateReservationPayload";
import { formatRFC } from "utils/date";
import useUserStore from "state/user";
import { User, UserRole } from "models/User";
import { Select } from "@chakra-ui/select";

export interface CreateReservationModalProps {
  users?: User[];
}

function CreateReservationModal(
  { users }: CreateReservationModalProps,
  ref: React.Ref<any>
): ReactElement {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const role = useUserStore((s) => s.role);
  useImperativeHandle(ref, () => ({
    show: onOpen,
    hide: onClose,
  }));

  const { handleSubmit, values, handleChange, touched, errors } = useFormik<
    CreateReservationPayload & { isManager?: boolean }
  >({
    initialValues: {
      isManager: role >= UserRole.MANAGER,
      from: formatRFC(new Date()),
      to: "08:00",
      username: "",
    },
    validationSchema: createReservationValidationSchema,
    onSubmit: (values) => {
      alert(JSON.stringify(values, null, 2));
    },
  });

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <form onSubmit={handleSubmit}>
          <ModalHeader>Vytvorit novou rezervaci</ModalHeader>
          <ModalCloseButton />
          <ModalBody pb={6}>
            <FormControl isInvalid={touched.from && !!errors.from} isRequired>
              <FormLabel>Zacatek rezervace</FormLabel>
              <Input
                placeholder="from"
                type="datetime-local"
                name="from"
                value={values.from}
                onChange={handleChange}
              />
              <FormErrorMessage>{errors.from}</FormErrorMessage>
            </FormControl>
            <FormControl mt={4} isInvalid={touched.to && !!errors.to}>
              <FormLabel>Doba trvani</FormLabel>
              <Input
                type="time"
                name="to"
                value={values.to}
                onChange={handleChange}
                isRequired
              />
              <FormErrorMessage>{errors.to}</FormErrorMessage>
            </FormControl>
            {users && (
              <FormControl
                mt={4}
                isInvalid={touched.username && !!errors.username}
              >
                <FormLabel>Uzivatel</FormLabel>
                <Select
                  name="username"
                  value={values.username}
                  onChange={handleChange}
                >
                  {users?.map((u) => (
                    <option value={u.username} key={u.username}>
                      {u.name} {u.lastname}
                    </option>
                  ))}
                </Select>
                <FormErrorMessage>{errors.username}</FormErrorMessage>
              </FormControl>
            )}
          </ModalBody>
          <ModalFooter>
            <Button colorScheme="blue" type="submit" mr={3}>
              Save
            </Button>
            <Button onClick={onClose}>Cancel</Button>
          </ModalFooter>
        </form>
      </ModalContent>
    </Modal>
  );
}

export default React.forwardRef(CreateReservationModal);
