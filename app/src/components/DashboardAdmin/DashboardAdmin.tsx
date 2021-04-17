import { Tab, TabList, TabPanel, TabPanels, Tabs } from "@chakra-ui/tabs";
import React, { ReactElement, useRef, useState } from "react";

import { RESERVATION } from "models/Reservation";
import { CTA } from "components/CTA";
import { CreateReservationModal } from "components/CreateReservationModal";
import { useGetAllUsers } from "utils/networking";
import { ParkingLot } from "components/ParkingLot";
import { ReservationList } from "components/ReservationList";

export interface DashboardAdminProps {}

function DashboardAdmin({}: DashboardAdminProps): ReactElement {
  const [isBig, setIsBig] = useState(false);
  const modalRef = useRef<any>();
  const { response } = useGetAllUsers();

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
            <ReservationList reservations={RESERVATION} />
          </TabPanel>
          <TabPanel width="100%">
            <ParkingLot reservations={RESERVATION} />
          </TabPanel>
        </TabPanels>
      </Tabs>
      <CTA onClick={() => modalRef.current?.show()} />
      <CreateReservationModal
        ref={modalRef}
        users={response ? response.data || [] : []}
      />
    </>
  );
}

export default DashboardAdmin;
