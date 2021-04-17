import React, { ReactElement, useEffect } from "react";
import { Reservation } from "models/Reservation";
import { Stack } from "@chakra-ui/layout";
import { PARKING_SLOTS } from "models/ParkingSlot";
import { ParkingSpot } from "components/ParkingSpot";
import { useGetParkingSlots } from "utils/networking";
import { User } from "models/User";

export interface ParkingLotProps {
  reservations: (Reservation & { user?: User })[];
  onDelete: () => void;
}

function ParkingLot({ reservations, onDelete }: ParkingLotProps): ReactElement {
  const { response: parkingSlotAvailability, trigger } = useGetParkingSlots();
  useEffect(() => {
    const interval = setInterval(trigger, 10000);
    trigger();
    return () => {
      clearInterval(interval);
    };
  }, []);

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
    if (!acc[r.parkingPlaceId]) {
      acc[r.parkingPlaceId] = [];
    }
    acc[r.parkingPlaceId].push(r);
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
            isAvailable={
              (parkingSlotAvailability && parkingSlotAvailability[p.spotId]) ||
              false
            }
            onDelete={onDelete}
          />
        ))}
      </Stack>
      <Stack direction="row">
        {secondRow.map((p) => (
          <ParkingSpot
            reservations={reservationsBySpotId[p.spotId]}
            id={p.spotId}
            isManager={p.isManager}
            isAvailable={
              (parkingSlotAvailability && parkingSlotAvailability[p.spotId]) ||
              false
            }
            onDelete={onDelete}
          />
        ))}
      </Stack>
    </Stack>
  );
}

export default ParkingLot;
