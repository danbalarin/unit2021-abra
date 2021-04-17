import React, { ReactElement, useCallback } from "react";
import { Box, BoxProps } from "@chakra-ui/layout";
import { Text } from "@chakra-ui/react";

import { Reservation } from "models/Reservation";
import { dateToText, timeRangeToText } from "utils/date";
import { ReservationControls } from "components/ReservationControls";
import useConfirmDelete from "utils/useConfirmDelete";

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

  const { ConfirmDelete, show: showDelete } = useConfirmDelete({
    onDelete: onDeleteConfirm,
  });

  const gridTemplateAreas = singleRow
    ? '"time name spotId controls"'
    : '"date spotId""time controls"';

  return (
    <Box
      display="grid"
      gridTemplateAreas={gridTemplateAreas}
      width={singleRow ? "100%" : ["100%", "100%", "400px"]}
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
      <ReservationControls onEdit={onEdit} onDelete={showDelete} />
      {ConfirmDelete}
    </Box>
  );
}

export default ReservationRow;
