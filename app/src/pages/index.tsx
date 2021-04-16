import { Container } from "components/Container";
import useStore from "state/user";
import { AuthenticatedRoute } from "components/AuthenticatedRoute";

const Index = () => {
  const sessionId = useStore((state) => state.sessionId);

  return (
    <AuthenticatedRoute>
      <Container height="100vh"></Container>
    </AuthenticatedRoute>
  );
};

export default Index;
