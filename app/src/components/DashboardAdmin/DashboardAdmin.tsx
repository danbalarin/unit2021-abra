import { Tab, TabList, TabPanel, TabPanels, Tabs } from "@chakra-ui/tabs";
import React, { ReactElement, useState } from "react";
import { parseISO, formatISO } from "date-fns";

import { ReservationRow } from "components/ReservationRow";
import { Reservation, RESERVATION } from "models/Reservation";
import { Section } from "components/Section";
import { dateToText } from "utils/dateToText";

export interface DashboardAdminProps {}

function DashboardAdmin({}: DashboardAdminProps): ReactElement {
  const [isBig, setIsBig] = useState(false);

  const days = RESERVATION.reduce((p, c) => {
    const day = formatISO(c.from);
    if (!p[day]) {
      p[day] = [];
    }
    p[day].push(c);
    return p;
  }, {} as { [k: string]: Reservation[] });

  return (
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
          {Object.entries(days).map(([date, day]) => (
            <Section
              key={date}
              title={dateToText(parseISO(date))}
              marginBottom="4"
            >
              {day.map((r) => (
                <ReservationRow
                  key={r.from + r.username}
                  reservation={r}
                  singleRow
                  marginBottom="1"
                  paddingY="1"
                />
              ))}
            </Section>
          ))}
        </TabPanel>
        <TabPanel>
          <p>two!</p>
        </TabPanel>
      </TabPanels>
    </Tabs>
  );
}

export default DashboardAdmin;
