import { useMediaQuery } from "@chakra-ui/media-query";
import React, { ReactElement } from "react";
import { parseISO, compareAsc, isBefore, subDays } from "date-fns";

import { ReservationRow } from "components/ReservationRow";
import { Reservation } from "models/Reservation";
import { Section } from "components/Section";
import { dateToText } from "utils/date";
import { Stack } from "@chakra-ui/layout";
import { Input } from "@chakra-ui/input";
import { useControllableState } from "@chakra-ui/hooks";
import { FormControl, FormLabel } from "@chakra-ui/form-control";
import { Switch } from "@chakra-ui/switch";
import { User } from "models/User";

export interface ReservationListProps {
  reservations: (Reservation & { user?: User })[];
  onDelete?: () => void;
}

function ReservationList({
  reservations,
  onDelete,
}: ReservationListProps): ReactElement {
  const [search, setSearch] = useControllableState({ defaultValue: "" });
  const [history, setHistory] = useControllableState({ defaultValue: false });
  const [isLargetThanMobile] = useMediaQuery("(min-width: 40em)");

  const days = reservations
    .filter(
      (r) =>
        r.user?.name.toString().includes(search.toLowerCase()) ||
        r.parkingPlaceId.toString().includes(search.toLowerCase())
    )
    .reduce((p, c) => {
      const date = c.from.split("T")[0];
      if (!p[date]) {
        p[date] = [];
      }
      p[date].push(c);
      return p;
    }, {} as { [k: string]: Reservation[] });

  return (
    <Stack>
      <Stack direction="row">
        <FormControl display="flex" alignItems="center">
          <FormLabel marginBottom="0">Vyhledat</FormLabel>
          <Input value={search} onChange={(e) => setSearch(e.target.value)} />
        </FormControl>
        <FormControl
          display="flex"
          alignItems="center"
          justifyContent="flex-end"
        >
          <FormLabel marginBottom="0">Ukaz historii</FormLabel>
          <Switch
            isChecked={history}
            onChange={(e) => setHistory(Boolean(e.target.checked))}
          />
        </FormControl>
      </Stack>
      {Object.entries(days)
        .sort(([date1], [date2]) =>
          compareAsc(parseISO(date1), parseISO(date2))
        )
        .filter(
          ([date]) =>
            history || !isBefore(parseISO(date), subDays(new Date(), 1))
        )
        .map(([date, day], i) => (
          <Section key={date + i} title={dateToText(date)} marginBottom="4">
            {day.map((r) => (
              <ReservationRow
                key={r.from + r.userId}
                reservation={r}
                singleRow={isLargetThanMobile}
                marginBottom="1"
                paddingY="1"
                onDelete={onDelete}
              />
            ))}
          </Section>
        ))}
    </Stack>
  );
}

export default ReservationList;
