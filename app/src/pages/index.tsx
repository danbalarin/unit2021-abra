import { Container } from "components/Container";
import useUserStore from "state/user";
import { AuthenticatedRoute } from "components/AuthenticatedRoute";
import { ELEVATED_ROLES } from "models/User";
import { DashboardAdmin } from "components/DashboardAdmin";
import { Dashboard } from "components/Dashboard";
import { Appbar } from "components/Appbar";

const Index = () => {
  const role = useUserStore((state) => state.role);
  console.log(role);
  return (
    <AuthenticatedRoute>
      <>
        <Container height="100vh">
          <Appbar />
          {ELEVATED_ROLES.includes(role) ? <DashboardAdmin /> : <Dashboard />}
        </Container>
      </>
    </AuthenticatedRoute>
  );
};

export default Index;
