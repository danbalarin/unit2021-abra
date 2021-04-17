import { Center, Stack } from "@chakra-ui/layout";
import { useToast } from "@chakra-ui/toast";
import React, { ReactElement, useEffect, useMemo, useRef } from "react";
import { isSameDay, isAfter, endOfToday, compareAsc, parseISO } from "date-fns";

import { Loading } from "components/Loading";
import useGeneralStore from "state/general";
import { Section } from "components/Section";
import { ReservationRow } from "components/ReservationRow";
import { CTA } from "components/CTA";
import { CreateReservationModal } from "components/CreateReservationModal";
import { useGetAllReservations } from "utils/networking";

export interface DashboardProps {}

function Dashboard({}: DashboardProps): ReactElement {
  useEffect(() => {
    useGeneralStore.getState().setHeading("Moje rezervace");
  }, []);
  const modalRef = useRef<any>();
  const toast = useToast();

  const { response, error, loading, trigger } = useGetAllReservations();

  const currentReservations = useMemo(
    () =>
      ((response && response.data) || []).filter((d) =>
        isSameDay(parseISO(d.from), Date.now())
      ),
    [response]
  );
  const upcomingReservations = useMemo(
    () =>
      ((response && response.data) || [])
        .filter((d) => isAfter(parseISO(d.from), endOfToday()))
        .sort((d1, d2) => compareAsc(parseISO(d1.from), parseISO(d2.from))),
    [response]
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
    <>
      <Stack
        direction={["column", "column", "row"]}
        paddingTop="2"
        paddingX="4"
        width="100%"
        height="100%"
        display="flex"
        justifyContent={["", "", "center"]}
        alignItems={["", "", "flex-start"]}
      >
        <Section
          title="Aktualni"
          marginRight={["0", "", "6"]}
          marginBottom={["3", "3", "0"]}
        >
          {currentReservations.map((r) => (
            <ReservationRow
              reservation={r}
              key={r.from + r.userId}
              onDelete={() => trigger()}
            />
          ))}
        </Section>
        <Section title="Budouci">
          {upcomingReservations.map((r) => (
            <ReservationRow
              reservation={r}
              key={r.from + r.userId}
              onDelete={() => trigger()}
            />
          ))}
        </Section>
      </Stack>
      <CTA onClick={() => modalRef.current?.show()} />
      <CreateReservationModal ref={modalRef} />
    </>
  );
}

export default Dashboard;
