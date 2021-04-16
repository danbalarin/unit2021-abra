import { Container } from "components/Container";
import useUserStore from "state/user";
import { AuthenticatedRoute } from "components/AuthenticatedRoute";
import { UserRole } from "models/User";
import { DashboardAdmin } from "components/DashboardAdmin";
import { Dashboard } from "components/Dashboard";
import { Appbar } from "components/Appbar";

const Index = () => {
  const role = useUserStore((state) => state.role);

  return (
    <AuthenticatedRoute>
      <>
        <Container height="100vh">
          <Appbar />
          {role === UserRole.ADMIN ? <DashboardAdmin /> : <Dashboard />}
        </Container>
      </>
    </AuthenticatedRoute>
  );
};

export default Index;
