import { useIntersectionObserver } from '@/hooks/useIntersectionObserver';
import { Stack } from '@chakra-ui/react';
import { useInfiniteQuery } from '@tanstack/react-query';
import { useEffect } from 'react';
import VirtualList from './VirtualList';

type VirtualizedInfiniteScrollV2Props<T> = {
  renderItem: (item: T, index: number) => JSX.Element;
  fetchData: (page: number) => Promise<T[]>;
  loader?: JSX.Element;
};

const VirtualizedInfiniteScrollV2 = <T,>({
  renderItem,
  fetchData,
  loader,
}: VirtualizedInfiniteScrollV2Props<T>) => {
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
    <Stack gap={0}>
      <VirtualList<T>
        data={data ?? []}
        renderItem={renderItem}
        overscan={1000}
      />

      {isFetching && loader}
      <div ref={lastItemRef as React.MutableRefObject<HTMLDivElement>} />
    </Stack>
  );
};

export default VirtualizedInfiniteScrollV2;
