import React, { ReactElement, useEffect } from "react";
import useGeneralStore from "state/general";

export interface DashboardProps {}

function Dashboard({}: DashboardProps): ReactElement {
  useEffect(() => {
    useGeneralStore.getState().setHeading("Moje rezervace");
  }, []);
  return <div>dashboard</div>;
}

export default Dashboard;
