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
import React, { ReactElement, useEffect, useImperativeHandle } from "react";
import { Select } from "@chakra-ui/select";
import { parseISO, addHours, addMinutes, formatISO } from "date-fns";

import {
  CreateReservationPayload,
  createReservationValidationSchema,
} from "models/CreateReservationPayload";
import { formatRFC } from "utils/date";
import useUserStore from "state/user";
import { User, UserRole } from "models/User";
import { usePutReservation } from "utils/networking";

export interface CreateReservationModalProps {
  users?: User[];
  onAdd?: () => void;
}

function CreateReservationModal(
  { users, onAdd }: CreateReservationModalProps,
  ref: React.Ref<any>
): ReactElement {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const role = useUserStore((s) => s.role);
  const { trigger, response } = usePutReservation();

  useImperativeHandle(ref, () => ({
    show: onOpen,
    hide: onClose,
  }));

  useEffect(() => {
    if (response && response.success) {
      onAdd && onAdd();
    }
  }, [response]);

  const { handleSubmit, values, handleChange, touched, errors } = useFormik<
    CreateReservationPayload & { isManager?: boolean; isReceptionist?: boolean }
  >({
    initialValues: {
      isManager: role >= UserRole.MANAGER,
      isReceptionist: role >= UserRole.RECEPCNI,
      from: formatRFC(new Date()),
      to: "08:00",
      userId: "",
    },
    validationSchema: createReservationValidationSchema,
    onSubmit: ({ isManager, isReceptionist, ...values }) => {
      isManager && isReceptionist;
      const [hours, minutes] = values.to.split(":").map((t) => +t);
      const to = formatISO(
        addMinutes(addHours(parseISO(values.from), hours), minutes)
      ).replace("+02:00", ""); // hotsif to remove timezone
      const body = new URLSearchParams();
      Object.entries({ ...values, to }).forEach(([k, v]) =>
        body.append(k, v as any)
      );
      trigger({ body: JSON.stringify({ ...values, to }) });
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
              <FormControl mt={4} isInvalid={touched.userId && !!errors.userId}>
                <FormLabel>Uzivatel</FormLabel>
                <Select
                  name="userId"
                  value={values.userId}
                  onChange={handleChange}
                >
                  {users?.map((u) => (
                    <option value={u.id} key={u.id}>
                      {u.name} {u.lastname}
                    </option>
                  ))}
                </Select>
                <FormErrorMessage>{errors.userId}</FormErrorMessage>
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
