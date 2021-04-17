import { useColorMode } from "@chakra-ui/color-mode";
import { AspectRatio, Box, Heading, Stack } from "@chakra-ui/layout";
import React, { ReactElement, useCallback } from "react";
import { isWithinInterval } from "date-fns";

import { Reservation } from "models/Reservation";
import { ReservationControls } from "components/ReservationControls";
import useConfirmDelete from "utils/useConfirmDelete";

export interface ParkingSpotProps {
  reservations: Reservation[];
  id: number;
  isManager?: boolean;
}

function ParkingSpot({
  reservations = [],
  id,
}: ParkingSpotProps): ReactElement {
  const { colorMode } = useColorMode();
  const onDeleteConfirm = useCallback(() => {
    console.log("delete");
  }, []);

  const { ConfirmDelete, show: showDelete } = useConfirmDelete({
    onDelete: onDeleteConfirm,
  });

  const isReserved = reservations.reduce(
    (acc, r) =>
      acc || isWithinInterval(new Date(), { start: r.from, end: r.to }),
    false
  );

  const isOccupied = Math.random() > 0.9;

  const reservedColor = {
    dark: "orange.500",
    light: "orange.300",
  };

  const basicColor = {
    dark: "green.500",
    light: "green.300",
  };

  const occupiedColor = {
    dark: "red.500",
    light: "red.300",
  };

  return (
    <AspectRatio
      width="80px"
      ratio={2 / 3}
      backgroundColor={
        isReserved
          ? reservedColor[colorMode]
          : isOccupied
          ? occupiedColor[colorMode]
          : basicColor[colorMode]
      }
      color={colorMode === "dark" ? "gray.100" : "gray.700"}
      borderRadius="md"
    >
      <Stack>
        <Heading size="sm">P-{id}</Heading>
        {isReserved || isOccupied ? (
          <ReservationControls onEdit={console.log} onDelete={showDelete} />
        ) : (
          <Box height="30px" />
        )}
        {ConfirmDelete}
      </Stack>
    </AspectRatio>
  );
}

export default ParkingSpot;
