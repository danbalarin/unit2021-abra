import React, { ReactElement } from "react";
import { Reservation } from "models/Reservation";
import { Stack } from "@chakra-ui/layout";
import { PARKING_SLOTS } from "models/ParkingSlot";
import { ParkingSpot } from "components/ParkingSpot";

export interface ParkingLotProps {
  reservations: Reservation[];
}

function ParkingLot({ reservations }: ParkingLotProps): ReactElement {
  const [firstRow, secondRow] = PARKING_SLOTS.reduce(
    (acc, c, i) => {
      if (i < 10) {
        acc[0].push(c);
      } else {
        acc[1].push(c);
      }
      return acc;
    },
    [[], []] as typeof PARKING_SLOTS[]
  );

  const reservationsBySpotId = reservations.reduce((acc, r) => {
    if (!acc[r.parkingSpotId]) {
      acc[r.parkingSpotId] = [];
    }
    acc[r.parkingSpotId].push(r);
    return acc;
  }, {} as { [k: string]: Reservation[] });

  return (
    <Stack width="100%">
      <Stack direction="row">
        {firstRow.map((p) => (
          <ParkingSpot
            reservations={reservationsBySpotId[p.spotId]}
            id={p.spotId}
            isManager={p.isManager}
          />
        ))}
      </Stack>
      <Stack direction="row">
        {secondRow.map((p) => (
          <ParkingSpot
            reservations={reservationsBySpotId[p.spotId]}
            id={p.spotId}
            isManager={p.isManager}
          />
        ))}
      </Stack>
    </Stack>
  );
}

export default ParkingLot;
