import { useIntersectionObserver } from '@/hooks/useIntersectionObserver';
import { Box, Stack } from '@chakra-ui/react';
import { useInfiniteQuery } from '@tanstack/react-query';
import { memo, useEffect, useState, useRef } from 'react';

type VirtualizedInfiniteScrollV1Props<T> = {
  renderItem: (item: T, index: number) => JSX.Element;
  fetchData: (page: number) => Promise<T[]>;
  loader?: JSX.Element;
  gap?: string | number;
};

const VirtualizedInfiniteScrollV1 = <T,>({
  renderItem,
  fetchData,
  loader,
  gap = 0,
}: VirtualizedInfiniteScrollV1Props<T>) => {
  const { hasNextPage, isFetching, fetchNextPage, data } = useInfiniteQuery({
    queryKey: ['items'],
    queryFn: async ({ pageParam = 1 }): Promise<T[]> => {
      return await fetchData(pageParam);
    },
    getNextPageParam: (lastPage, pages) => {
      return lastPage.length ? pages.length + 1 : undefined;
    },
    getPreviousPageParam: (firstPage, pages) => {
      return firstPage.length ? pages.length - 1 : undefined;
    },
    select: (data) => data.pages.flatMap((page) => page as T[]),
    initialPageParam: 1,
  });

  const { isIntersecting, ref: lastItemRef } = useIntersectionObserver({
    threshold: 0,
  });

  useEffect(() => {
    if (isIntersecting && hasNextPage && fetchNextPage) {
      fetchNextPage();
    }
  }, [isIntersecting, hasNextPage, fetchNextPage]);

  return (
    <Stack gap={gap}>
      {data?.map((item, index) => (
        <ItemWrapper key={index} index={index}>
          {renderItem(item, index)}
        </ItemWrapper>
      ))}
      {isFetching && loader}
      <div ref={lastItemRef as React.MutableRefObject<HTMLDivElement>} />
    </Stack>
  );
};

// IntersectionObserver 옵션 개선
const observerOptions = {
  root: null,
  rootMargin: '200px',
  threshold: 0,
};

const observerCallbacks = new Map<string, (isIntersecting: boolean) => void>();
const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    observerCallbacks.get(entry.target.id)?.(entry.isIntersecting);
  });
}, observerOptions);

const estimatedItemHeight = 400;

const ItemWrapper = memo(
  ({ children, index }: { children: React.ReactNode; index: number }) => {
    const [height, setHeight] = useState<number | null>(null);
    const [isVisible, setIsVisible] = useState(true);
    const elementRef = useRef<HTMLDivElement>(null);
    const elementId = `item-${index}`;

    useEffect(() => {
      const element = elementRef.current;
      if (!element) return;

      const callback = (isIntersecting: boolean) => {
        setIsVisible(isIntersecting);
        if (element) {
          const { clientHeight } = element;
          if (height !== clientHeight) {
            setHeight(clientHeight);
          }
        }
      };

      observerCallbacks.set(elementId, callback);
      observer.observe(element);

      return () => {
        observer.unobserve(element);
        observerCallbacks.delete(elementId);
      };
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [elementRef.current]);

    return (
      <Box
        ref={elementRef}
        id={elementId}
        h={isVisible ? 'auto' : (height ?? estimatedItemHeight)}
      >
        {isVisible && children}
      </Box>
    );
  },
  (prevProps, nextProps) => prevProps.index === nextProps.index
);

export default VirtualizedInfiniteScrollV1;
