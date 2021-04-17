import { Tab, TabList, TabPanel, TabPanels, Tabs } from "@chakra-ui/tabs";
import React, { ReactElement, useMemo, useRef, useState } from "react";

import { CTA } from "components/CTA";
import { CreateReservationModal } from "components/CreateReservationModal";
import { useGetAllReservations, useGetAllUsers } from "utils/networking";
import { ParkingLot } from "components/ParkingLot";
import { ReservationList } from "components/ReservationList";

export interface DashboardAdminProps {}

function DashboardAdmin({}: DashboardAdminProps): ReactElement {
  const [isBig, setIsBig] = useState(false);
  const modalRef = useRef<any>();
  const { response: usersResponse } = useGetAllUsers();
  const { response: reservationsResponse, trigger } = useGetAllReservations();

  const reservationsWithUser = useMemo(
    () =>
      reservationsResponse &&
      usersResponse &&
      reservationsResponse.data.map((r) => ({
        ...r,
        user: usersResponse.data?.find((u) => u.id === r.userId),
      })),
    [reservationsResponse, usersResponse]
  );

  return (
    <>
      <Tabs
        marginTop="8"
        index={isBig ? 1 : 0}
        colorScheme="blue"
        onChange={(index) => setIsBig(index === 1)}
        isLazy
        width="100%"
        display="flex"
        flexDirection="column"
        alignItems="center"
        paddingX={["", "8"]}
      >
        <TabList display="flex" justifyContent="space-evenly" maxWidth="300px">
          <Tab width="100%">Seznam</Tab>
          <Tab width="100%">Parkoviste</Tab>
        </TabList>
        <TabPanels>
          <TabPanel width="100%">
            <ReservationList
              reservations={reservationsWithUser || []}
              onDelete={() => trigger()}
            />
          </TabPanel>
          <TabPanel width="100%">
            <ParkingLot
              reservations={reservationsWithUser || []}
              onDelete={() => trigger()}
            />
          </TabPanel>
        </TabPanels>
      </Tabs>
      <CTA onClick={() => modalRef.current?.show()} />
      <CreateReservationModal
        ref={modalRef}
        users={usersResponse ? usersResponse.data || [] : []}
        onAdd={() => {
          modalRef.current?.hide();
          trigger();
        }}
      />
    </>
  );
}

export default DashboardAdmin;
