import React, { ReactElement, useCallback, useRef } from "react";
import { Box } from "@chakra-ui/layout";
import { Button, Text } from "@chakra-ui/react";
import { format, isToday } from "date-fns";
import { cs } from "date-fns/locale";

import { Reservation } from "models/Reservation";
import { DeleteIcon, EditIcon } from "@chakra-ui/icons";
import { ConfirmDelete } from "components/ConfirmDelete";

export interface ReservationRowProps {
  reservation: Reservation;
}

function ReservationRow({ reservation }: ReservationRowProps): ReactElement {
  const onEdit = useCallback(() => {
    console.log("edit");
  }, []);
  const onDeleteConfirm = useCallback(() => {
    console.log("delete");
  }, []);
  const confirmRef = useRef<any>();
  const onDelete = useCallback(() => {
    confirmRef.current.show();
  }, [confirmRef.current]);

  const date = isToday(reservation.from)
    ? "Dnes"
    : format(reservation.from, "dd. MMMM", { locale: cs });
  const time = `${format(reservation.from, "hh:mm")}-${format(
    reservation.to,
    "hh:mm"
  )}`;

  return (
    <Box
      display="grid"
      gridTemplateAreas={'"date spotId""time controls"'}
      width={["100%", "400px"]}
      backgroundColor="gray.100"
      color="black"
      padding="2"
      borderRadius="md"
      shadow="lg"
      transition=".3s all"
      _hover={{ backgroundColor: "blue.100", shadow: "xl" }}
    >
      <Text gridArea="date">{date}</Text>
      <Text gridArea="spotId" textAlign="right" fontWeight="bold">
        P-{reservation.parkingSpotId}
      </Text>
      <Text gridArea="time" display="flex" alignItems="center">
        {time}
      </Text>
      <Text gridArea="controls" textAlign="right">
        <Button variant="unstyled" size="xs" onClick={onEdit}>
          <EditIcon />
        </Button>
        <Button variant="unstyled" size="xs" onClick={onDelete}>
          <DeleteIcon />
        </Button>
      </Text>
      <ConfirmDelete ref={confirmRef} onConfirm={onDeleteConfirm} />
    </Box>
  );
}

export default ReservationRow;
