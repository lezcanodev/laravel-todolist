import { useCallback, useEffect,  useState } from "react";

export interface UseServicesOpts<TData, TRequest> {
  method: (request?: TRequest) => Promise<TData>;
  initialFetching?: boolean;
  simpleCache?: boolean; // indica si usar un sistema de cache simple
  cacheKey?: string
}

/* eslint-disable */
const simpleCacheStore: any = {};
/* eslint-enable */

export const useServices = <TData, TRequest>({
  method,
  initialFetching = false,
  simpleCache = true,
  cacheKey
}: UseServicesOpts<TData, TRequest>) => {
  const [loading, setLoading] = useState<boolean>(false);
  const [data, setData] = useState<TData | null>(null);
  const [error, setError] = useState<unknown | null>(null);

  const fetchData = useCallback(async (request?: TRequest) => {
    setLoading(true);
    try {
      // si ya existe re-utilizamos
      if(cacheKey && simpleCacheStore?.[cacheKey] && simpleCache){
        setData(simpleCacheStore?.[cacheKey]);
        return;
      }

      const data = await method(request);
      setData(data || null);
      setError(null);

      // guardamos el resultado en el cache en caso de estar activado
      if(cacheKey && simpleCache){
        simpleCacheStore[cacheKey] = data || null;
      }

    } catch (error: unknown) {
      setError(error);
      setData(null);
      throw error;
    } finally {
      setLoading(false);
    }
  }, [method, cacheKey , simpleCache]);

  useEffect(() => {
    if (initialFetching) {
      fetchData();
    }
  }, [fetchData, initialFetching]);

  return { loading, data, error, fetchData, setData };
};
