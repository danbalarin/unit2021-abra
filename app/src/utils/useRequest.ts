import { Input, Options } from "ky";
import { useCallback, useEffect, useRef, useState } from "react";
import {
  kyInstance,
  kyInstanceProprietary,
  throwOnSoftError,
} from "./networking";

const useRequest = <T = any>(
  url: Input,
  options?: Options,
  useProprietary?: boolean,
  manualTrigger?: boolean
) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error>();
  const [response, setResponse] = useState<T | void>();
  const optionsRef = useRef<Options>();

  const ky = useProprietary ? kyInstanceProprietary : kyInstance;

  const sendRequest = useCallback(
    (options: Options) => {
      setLoading(true);
      ky(url, options)
        .json<T>()
        .then(throwOnSoftError)
        .then(setResponse)
        .catch(setError)
        .finally(() => setLoading(false));
    },
    [url]
  );

  const trigger = (owOptions?: Options) => {
    sendRequest({ ...options, retry: { limit: 1 }, ...owOptions });
  };

  useEffect(() => {
    if (manualTrigger) {
      return;
    }
    if (JSON.stringify(optionsRef.current) !== JSON.stringify(options)) {
      optionsRef.current = options;
      sendRequest({ ...options });
    }
  }, [url, options]);

  return { loading, error, response, trigger };
};

export default useRequest;
