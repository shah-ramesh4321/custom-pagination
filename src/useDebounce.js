import { useState, useEffect } from "react";

export function useDebounce(value, delay) {
  const [debValue, setDebValue] = useState();

  useEffect(() => {
    const debounceHandler = setTimeout(() => {
      setDebValue(value);
    }, delay);
    return () => {
      clearTimeout(debounceHandler);
    };
  }, [value, delay]);

  return debValue;
}
