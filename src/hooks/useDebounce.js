import { useState, useEffect } from 'react';

const useDebounce = (callback, delay) => {
  const [debouncedValue, setDebouncedValue] = useState('');

  useEffect(() => {
    const handler = setTimeout(() => {
      callback(debouncedValue);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [debouncedValue, callback, delay]);

  return (value) => {
    setDebouncedValue(value);
  };
};

export default useDebounce;