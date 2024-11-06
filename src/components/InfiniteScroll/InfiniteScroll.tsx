import { useIntersectionObserver } from '@/hooks/useIntersectionObserver';
import { Stack } from '@chakra-ui/react';
import { useInfiniteQuery } from '@tanstack/react-query';
import { memo, useEffect } from 'react';

type InfiniteScrollProps = {
  renderItem: (item: { content: string }, index: number) => JSX.Element;
  fetchData: (page: number) => Promise<{ content: string }[]>;
  loader?: JSX.Element;
  gap?: string | number;
};

const InfiniteScroll = ({
  renderItem,
  fetchData,
  loader,
  gap = 0,
}: InfiniteScrollProps) => {
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

const PageItems = memo(
  ({
    items,
    renderItem,
    pageIndex,
    gap = 0,
  }: {
    items: { content: string }[];
    renderItem: (item: { content: string }, index: number) => JSX.Element;
    pageIndex: number;
    gap?: string | number;
  }) => {
    return (
      <Stack gap={gap}>
        {items.map((item, index) => renderItem(item, pageIndex * 10 + index))}
      </Stack>
    );
  }
);

export default InfiniteScroll;
