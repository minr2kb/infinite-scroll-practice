import { useEffect, useState } from 'react';
import useThrottle from './useThrottle.ts';

const useScroll = (scrollContainer: HTMLElement) => {
  const [scrollTop, setScrollTop] = useState<number>(0);
  const [containerHeight, setContainerHeight] = useState<number>(0);

  const handleScrollHeight = () => {
    if (!scrollContainer)
      return console.log('no scrollContainer', 'handleScrollHeight');

    setContainerHeight(scrollContainer.scrollHeight);
    setScrollTop(scrollContainer.scrollTop);
  };

  const throttledScrollHeight = useThrottle(() => {
    handleScrollHeight();
    console.log('Throttled!');
  });

  useEffect(() => {
    if (!scrollContainer)
      return console.log('no scrollContainer', 'addEventListener');

    scrollContainer.addEventListener('scroll', throttledScrollHeight);

    return () =>
      scrollContainer.removeEventListener('scroll', throttledScrollHeight);
  }, [scrollContainer]);

  return { scrollTop, containerHeight };
};

export default useScroll;
