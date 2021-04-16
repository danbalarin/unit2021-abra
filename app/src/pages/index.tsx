import { Container } from "../components/Container";
import useStore from "../state/user";

const Index = () => {
  const sessionId = useStore((state) => state.sessionId);

  return <Container height="100vh">.{sessionId}.</Container>;
};

export default Index;
