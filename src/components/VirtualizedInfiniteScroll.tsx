import { useIntersectionObserver } from '@/hooks/useIntersectionObserver';
import { Box, Stack } from '@chakra-ui/react';
import { useInfiniteQuery } from '@tanstack/react-query';
import { memo, useEffect, useState, useRef } from 'react';

type VirtualizedInfiniteScrollProps<T> = {
  renderItem: (item: T, index: number) => JSX.Element;
  fetchData: (page: number) => Promise<T[]>;
  loader?: JSX.Element;
  gap?: string | number;
};

const VirtualizedInfiniteScroll = <T,>({
  renderItem,
  fetchData,
  loader,
  gap = 0,
}: VirtualizedInfiniteScrollProps<T>) => {
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
      {data?.pages.map((page, pageIndex) => (
        <PageItems
          key={pageIndex}
          items={page}
          renderItem={renderItem}
          pageIndex={pageIndex}
          gap={gap}
        />
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

// PageItems 컴포넌트도 제네릭으로 변경
const PageItems = memo(
  <T,>({
    items,
    renderItem,
    pageIndex,
    gap = 0,
  }: {
    items: T[];
    renderItem: (item: T, index: number) => JSX.Element;
    pageIndex: number;
    gap?: string | number;
  }) => {
    return (
      <Stack gap={gap}>
        {items.map((item, index) => (
          <ItemWrapper key={index} index={pageIndex * 10 + index}>
            {renderItem(item, pageIndex * 10 + index)}
          </ItemWrapper>
        ))}
      </Stack>
    );
  }
) as <T>(props: {
  items: T[];
  renderItem: (item: T, index: number) => JSX.Element;
  pageIndex: number;
  gap?: string | number;
}) => JSX.Element;

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
        h={isVisible ? 'auto' : (height ?? estimatedItemHeight)}
      >
        {isVisible && children}
      </Box>
    );
  },
  (prevProps, nextProps) => prevProps.index === nextProps.index
);

export default VirtualizedInfiniteScroll;
