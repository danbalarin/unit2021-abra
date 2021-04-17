import { useMediaQuery } from "@chakra-ui/media-query";
import React, { ReactElement } from "react";
import { parseISO, formatISO } from "date-fns";

import { ReservationRow } from "components/ReservationRow";
import { Reservation } from "models/Reservation";
import { Section } from "components/Section";
import { dateToText } from "utils/date";
import { Stack } from "@chakra-ui/layout";
import { Input } from "@chakra-ui/input";
import { useControllableState } from "@chakra-ui/hooks";
import { FormControl, FormLabel } from "@chakra-ui/form-control";

export interface ReservationListProps {
  reservations: Reservation[];
}

function ReservationList({ reservations }: ReservationListProps): ReactElement {
  const [value, setValue] = useControllableState({ defaultValue: "" });
  const [isLargetThanMobile] = useMediaQuery("(min-width: 40em)");

  const days = reservations
    .filter(
      (r) =>
        r.userId.toString().includes(value.toLowerCase()) ||
        r.parkingPlaceId.toString().includes(value.toLowerCase())
    )
    .reduce((p, c) => {
      if (!p[c.from]) {
        p[c.from] = [];
      }
      p[c.from].push(c);
      return p;
    }, {} as { [k: string]: Reservation[] });

  return (
    <Stack>
      <Stack direction="row">
        <FormControl display="flex" alignItems="center">
          <FormLabel marginBottom="0">Vyhledat</FormLabel>
          <Input value={value} onChange={(e) => setValue(e.target.value)} />
        </FormControl>
      </Stack>
      {Object.entries(days).map(([date, day]) => (
        <Section key={date} title={dateToText(date)} marginBottom="4">
          {day.map((r) => (
            <ReservationRow
              key={r.from + r.userId}
              reservation={r}
              singleRow={isLargetThanMobile}
              marginBottom="1"
              paddingY="1"
            />
          ))}
        </Section>
      ))}
    </Stack>
  );
}

export default ReservationList;
