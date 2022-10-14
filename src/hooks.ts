import { useEffect, useState } from "react";

type FetchResult<T> = {
  data: T | undefined;
  loading: boolean;
  error: Error | undefined;
};

export function useFetch<T>(source: Promise<T>): FetchResult<T> {
  const [data, setData] = useState<T>();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error>();

  useEffect(() => {
    source
      .then((value) => {
        setData(value);
        setLoading(false);
      })
      .catch((e) => {
        setError(e);
        setLoading(false);
        console.log({ e });
      });
  }, [setData, setLoading, setError]);

  return { data, loading, error };
}
