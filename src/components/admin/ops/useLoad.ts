"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { describeError } from "@/lib/operations";

/**
 * On-demand Firestore read with loading / error state and a reload().
 * Late responses from superseded requests are ignored.
 */
export function useLoad<T>(load: () => Promise<T>, deps: unknown[]) {
  const [data, setData] = useState<T | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const req = useRef(0);

  const run = useCallback(() => {
    const id = ++req.current;
    setLoading(true);
    setError(null);
    load()
      .then((d) => id === req.current && setData(d))
      .catch((err) => {
        if (id !== req.current) return;
        console.error(err);
        setError(describeError(err));
      })
      .finally(() => id === req.current && setLoading(false));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);

  useEffect(() => {
    run();
  }, [run]);

  return { data, error, loading, reload: run, setData };
}
