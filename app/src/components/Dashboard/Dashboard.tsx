import { Center, Stack } from "@chakra-ui/layout";
import { useToast } from "@chakra-ui/toast";
import React, { ReactElement, useEffect } from "react";
import { isSameDay, isAfter, endOfToday } from "date-fns";

import { Reservation } from "models/Reservation";
import { Loading } from "components/Loading";
import useGeneralStore from "state/general";
import useRequest from "utils/useRequest";
import { Section } from "components/Section";
import { ReservationRow } from "components/ReservationRow";

export interface DashboardProps {}

function Dashboard({}: DashboardProps): ReactElement {
  useEffect(() => {
    useGeneralStore.getState().setHeading("Moje rezervace");
  }, []);
  const toast = useToast();

  const { loading, error } = useRequest("asdada");

  const data: Reservation[] = [
    {
      username: "",
      from: new Date("2021-04-16T08:00:00+00:00"),
      to: new Date("2021-04-16T18:00:00+00:00"),
      parkingSpotId: 102,
    },
    {
      username: "",
      from: new Date("2021-04-17T08:00:00+00:00"),
      to: new Date("2021-04-17T18:00:00+00:00"),
      parkingSpotId: 105,
    },
    {
      username: "",
      from: new Date("2021-04-18T08:00:00+00:00"),
      to: new Date("2021-04-18T18:00:00+00:00"),
      parkingSpotId: 105,
    },
  ];

  const currentReservations = data.filter((d) => isSameDay(d.from, Date.now()));
  const upcomingReservations = data.filter((d) =>
    isAfter(d.from, endOfToday())
  );

  useEffect(() => {
    if (error) {
      toast({
        status: "error",
        title: error?.name,
        description: error?.message,
        isClosable: true,
      });
    }
  }, [error]);

  if (loading) {
    return (
      <Center h="100%">
        <Loading />
      </Center>
    );
  }

  return (
    <Stack
      direction={["column", "row"]}
      paddingTop="2"
      paddingX="4"
      width="100%"
      height="100%"
      display="flex"
      justifyContent="center"
      alignItems="flex-start"
    >
      <Section
        title="Aktualni"
        marginRight={["0", "6"]}
        marginBottom={["3", "0"]}
      >
        {currentReservations.map((r) => (
          <ReservationRow reservation={r} />
        ))}
      </Section>
      <Section title="Budouci">
        {upcomingReservations.map((r) => (
          <ReservationRow reservation={r} />
        ))}
      </Section>
    </Stack>
  );
}

export default Dashboard;
