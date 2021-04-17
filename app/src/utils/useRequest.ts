import { Input, Options } from "ky";
import { useEffect, useRef, useState } from "react";
import { kyInstance, throwOnSoftError } from "./networking";

const useRequest = <T = any>(url: Input, options?: Options) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error>();
  const [response, setResponse] = useState<T | void>();
  const optionsRef = useRef<Options>();

  useEffect(() => {
    if (JSON.stringify(optionsRef.current) !== JSON.stringify(options)) {
      optionsRef.current = options;
      setLoading(true);
      kyInstance(url, options)
        .json<T>()
        .then(throwOnSoftError)
        .then(setResponse)
        .catch(setError)
        .finally(() => setLoading(false));
    }
  }, [url, options]);

  return { loading, error, response };
};

export default useRequest;
