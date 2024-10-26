import { useIntersectionObserver } from '@/hooks/useIntersectionObserver';
import { Box, Show, Stack } from '@chakra-ui/react';
import { useInfiniteQuery } from '@tanstack/react-query';
import { memo, useEffect, useState } from 'react';

type VirtualizedInfiniteScrollProps = {
  renderItem: (item: { content: string }, index: number) => JSX.Element;
  fetchData: (page: number) => Promise<{ content: string }[]>;
  loader?: JSX.Element;
  gap?: string | number;
  estimatedItemHeight?: number;
};

const VirtualizedInfiniteScroll = ({
  renderItem,
  fetchData,
  loader,
  gap = 0,
  estimatedItemHeight = 400,
}: VirtualizedInfiniteScrollProps) => {
  const { hasNextPage, isFetching, fetchNextPage, data } = useInfiniteQuery({
    queryKey: ['items'],
    queryFn: async ({ pageParam = 1 }): Promise<{ content: string }[]> => {
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
        <RenderItems
          key={pageIndex}
          items={page}
          renderItem={renderItem}
          pageIndex={pageIndex}
          gap={gap}
          estimatedItemHeight={estimatedItemHeight}
        />
      ))}
      {isFetching && loader}
      <div ref={lastItemRef as React.MutableRefObject<HTMLDivElement>} />
    </Stack>
  );
};

const RenderItems = memo(
  ({
    items,
    renderItem,
    pageIndex,
    gap = 0,
    estimatedItemHeight,
  }: {
    items: { content: string }[];
    renderItem: (item: { content: string }, index: number) => JSX.Element;
    pageIndex: number;
    gap?: string | number;
    estimatedItemHeight?: number;
  }) => {
    return (
      <Stack gap={gap}>
        {items.map((item, index) => (
          <VirtualizedItemWrapper
            key={index}
            estimatedItemHeight={estimatedItemHeight}
          >
            {renderItem(item, pageIndex * 10 + index)}
          </VirtualizedItemWrapper>
        ))}
      </Stack>
    );
  }
);

const VirtualizedItemWrapper = memo(
  ({
    children,
    estimatedItemHeight,
  }: {
    children: React.ReactNode;
    estimatedItemHeight?: number;
  }) => {
    const [height, setHeight] = useState<number | null>(null);

    const { isIntersecting: isVisible, ref } = useIntersectionObserver({
      threshold: 0,
      initialIsIntersecting: true,
    });

    useEffect(() => {
      if (ref.current) {
        const height = ref.current.clientHeight;
        setHeight(height);
      }
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [ref.current]);

    return (
      <Box
        ref={ref as React.MutableRefObject<HTMLDivElement>}
        h={
          isVisible
            ? 'auto'
            : height
              ? `${height}px`
              : `${estimatedItemHeight}px`
        }
      >
        <Show when={isVisible}>{children}</Show>
      </Box>
    );
  }
);

export default VirtualizedInfiniteScroll;
