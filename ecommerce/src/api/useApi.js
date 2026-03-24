import React, { useCallback, useEffect } from "react";

export const useApi = (apiFunction, dependencies = []) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchData = useCallback(
    async (...args) => {
      setLoading(true);
      setError(null);

      try {
        const result = await apiFunction(...args);
        setData(result);
        return result;
      } catch (err) {
        setError(err.message);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [apiFunction, ...dependencies],
  );

  useEffect(() => {
    if (dependencies.length > 0) {
      fetchData();
    }
  }, [fetchData, ...dependencies]);

  return { data, loading, error, refetch: fetchData };
};

export const useMutation = (mutationFunction, options = []) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const mutate = useCallback(
    async (...args) => {
      setLoading(true);
      setError(null);

      try {
        const result = await mutationFunction(...args);
        if (options.onSuccess) {
          options.onSuccess(result);
        }
        return result;
      } catch (err) {
        setError(err.message);
        if (options.onError) {
          options.onError(err);
        }
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [mutationFunction, options],
  );
  return { mutate, loading, error };
};

export const QueryClient = {
  invalidate: (key) => {
    console.log(`Invalidating cache for : ${key}`);
    window.location.reload();
  },
};

export default useApi;
