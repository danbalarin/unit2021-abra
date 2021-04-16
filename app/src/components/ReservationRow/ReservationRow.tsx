import React, { ReactElement, useCallback, useRef } from "react";
import { Box, BoxProps } from "@chakra-ui/layout";
import { IconButton, Text } from "@chakra-ui/react";

import { Reservation } from "models/Reservation";
import { DeleteIcon, EditIcon } from "@chakra-ui/icons";
import { ConfirmDelete } from "components/ConfirmDelete";
import { dateToText, timeRangeToText } from "utils/dateToText";

export interface ReservationRowProps extends BoxProps {
  reservation: Reservation;
  singleRow?: boolean;
}

function ReservationRow({
  reservation,
  singleRow,
  ...props
}: ReservationRowProps): ReactElement {
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

  const gridTemplateAreas = singleRow
    ? '"time name spotId controls"'
    : '"date spotId""time controls"';

  return (
    <Box
      display="grid"
      gridTemplateAreas={gridTemplateAreas}
      width={singleRow ? "100%" : ["100%", "400px"]}
      backgroundColor="gray.100"
      color="black"
      padding="2"
      borderRadius="md"
      shadow="lg"
      transition=".3s all"
      _hover={{ backgroundColor: "blue.100", shadow: "xl" }}
      {...props}
    >
      {!singleRow && (
        <Text gridArea="date">{dateToText(reservation.from)}</Text>
      )}
      {singleRow && (
        <Text
          gridArea="name"
          display="flex"
          alignItems="center"
          justifyContent="flex-start"
        >
          {reservation.username}
        </Text>
      )}
      <Text
        gridArea="spotId"
        textAlign="right"
        fontWeight="bold"
        display="flex"
        justifyContent="flex-end"
        alignItems="center"
      >
        P-{reservation.parkingSpotId}
      </Text>
      <Text
        gridArea="time"
        display="flex"
        alignItems="center"
        maxWidth="fit-content"
        width="100px"
      >
        {timeRangeToText(reservation.from, reservation.to)}
      </Text>
      <Box
        gridArea="controls"
        display="flex"
        justifyContent="flex-end"
        textAlign="right"
      >
        <IconButton
          aria-label="edit reservation"
          variant="unstyled"
          size="sm"
          onClick={onEdit}
          icon={<EditIcon height="1.5em" width="1.5em" />}
        />
        <IconButton
          aria-label="delete reservation"
          variant="unstyled"
          size="sm"
          onClick={onDelete}
          icon={<DeleteIcon height="1.5em" width="1.5em" />}
        />
      </Box>
      <ConfirmDelete ref={confirmRef} onConfirm={onDeleteConfirm} />
    </Box>
  );
}

export default ReservationRow;
