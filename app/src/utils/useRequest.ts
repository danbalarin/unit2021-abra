import { Input, Options } from "ky";
import { useEffect, useState } from "react";
import { kyInstance } from "./networking";

const useRequest = (url: Input, options?: Options) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error>();
  const [response, setResponse] = useState<Response | void>();

  useEffect(() => {
    setLoading(true);
    kyInstance(url, options)
      .catch(setError)
      .then(setResponse)
      .finally(() => setLoading(false));
  }, [url, options]);

  return { loading, error, response };
};

export default useRequest;
