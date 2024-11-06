import { useRef } from 'react';

const useThrottle = (fn: (arg?: any) => void, delay = 225) => {
  const timer = useRef<number | null>(null);

  return (...params: any) => {
    if (timer.current) return;

    timer.current = setTimeout(() => {
      fn(...params);
      timer.current = null;
    }, delay);
  };
};

export default useThrottle;
