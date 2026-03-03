import { useEffect, useState } from "react";

export function useIntents() {
  const [intents, setIntents] = useState([]);
  const [error, setError] = useState<string | null>(null);

  async function load() {
    try {
      const res = await fetch("/api/intents");
      const data = await res.json();
      setIntents(data);
    } catch (err: any) {
      setError("Failed to load intents");
    }
  }

  useEffect(() => {
    load();
    const interval = setInterval(load, 5000);
    return () => clearInterval(interval);
  }, []);

  return { intents, error, reload: load };
}
