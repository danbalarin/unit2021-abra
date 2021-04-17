import { useColorMode } from "@chakra-ui/color-mode";
import { AspectRatio, Box, Heading, Stack } from "@chakra-ui/layout";
import React, { ReactElement, useEffect } from "react";
import { isWithinInterval } from "date-fns";

import { Reservation } from "models/Reservation";
import { ReservationControls } from "components/ReservationControls";
import useConfirmDelete from "utils/useConfirmDelete";
import { useDeleteReservation } from "utils/networking";

export interface ParkingSpotProps {
  reservations: Reservation[];
  id: number;
  isManager?: boolean;
  isAvailable?: boolean;
  onDelete?: () => void;
}

function ParkingSpot({
  reservations = [],
  id,
  isAvailable,
  onDelete,
}: ParkingSpotProps): ReactElement {
  const { colorMode } = useColorMode();
  const reservation = reservations.find((r) =>
    isWithinInterval(new Date(), {
      start: new Date(r.from),
      end: new Date(r.to),
    })
  );

  const { trigger: onDeleteConfirm, response } = useDeleteReservation(
    reservation?.id || 0
  );

  useEffect(() => {
    response && response.success && onDelete && onDelete();
  });

  const { ConfirmDelete, show: showDelete } = useConfirmDelete({
    onDelete: onDeleteConfirm,
  });

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
        isAvailable
          ? occupiedColor[colorMode]
          : reservation
          ? reservedColor[colorMode]
          : basicColor[colorMode]
      }
      color={colorMode === "dark" ? "gray.100" : "gray.700"}
      borderRadius="md"
    >
      <Stack>
        <Heading size="sm">P-{id}</Heading>
        {reservation ? (
          <ReservationControls onEdit={console.log} onDelete={showDelete} />
        ) : (
          <Box height="30px" />
        )}
        {ConfirmDelete}
      </Stack>
    </AspectRatio>
  );
}

export default React.memo(
  ParkingSpot,
  (prev, next) => JSON.stringify(prev) === JSON.stringify(next)
);
