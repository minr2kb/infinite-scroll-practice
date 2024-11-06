import { useEffect, useState } from 'react';
import useThrottle from './useThrottle.ts';

const useWindowScrollTop = () => {
  const [scrollTop, setScrollTop] = useState<number>(0);

  const handleScrollHeight = () => {
    if (!window) return console.log('no window', 'handleScrollHeight');
    setScrollTop(window.scrollY);
  };

  const throttledScrollHeight = useThrottle(() => {
    handleScrollHeight();
  });

  useEffect(() => {
    if (!window) return console.log('no window', 'addEventListener');

    window.addEventListener('scroll', throttledScrollHeight);

    return () => window.removeEventListener('scroll', throttledScrollHeight);
  }, [window]);

  return { scrollTop };
};

export default useWindowScrollTop;
