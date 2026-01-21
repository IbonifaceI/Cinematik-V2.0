import { useRef, useMemo } from 'react';

const useDebounce = (callback, delay) => {
  const timer = useRef();

  const memoizedCallback = useMemo(
    () =>
      function debouncedFunction(...args) {
        clearTimeout(timer.current);
        timer.current = setTimeout(() => callback(...args), delay);
      },
    [callback, delay]
  );

  return memoizedCallback;
};

export default useDebounce;