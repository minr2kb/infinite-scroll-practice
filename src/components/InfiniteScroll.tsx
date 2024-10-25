import { Show, Stack } from '@chakra-ui/react';
import { useInfiniteQuery } from '@tanstack/react-query';
import { memo, useEffect, useRef, useState } from 'react';

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
  const fetchItems = async ({
    pageParam = 1,
  }): Promise<{ content: string }[]> => {
    return await fetchData(pageParam);
  };
  const { hasNextPage, isFetching, fetchNextPage, data } = useInfiniteQuery({
    queryKey: ['items'],
    queryFn: fetchItems,
    getNextPageParam: (lastPage, pages) => {
      return lastPage.length ? pages.length + 1 : undefined;
    },
    getPreviousPageParam: (firstPage, pages) => {
      return firstPage.length ? pages.length - 1 : undefined;
    },
    initialPageParam: 1,
  });

  const lastItemRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting && hasNextPage) {
        fetchNextPage();
      }
    });

    if (lastItemRef.current) {
      observer.observe(lastItemRef.current);
    }

    return () => {
      if (lastItemRef.current) {
        observer.unobserve(lastItemRef.current);
      }
    };
  }, [hasNextPage, fetchNextPage]);

  return (
    <Stack gap={gap}>
      {data?.pages.map((page, pageIndex) => (
        <RenderItems
          key={pageIndex}
          items={page}
          renderItem={renderItem}
          pageIndex={pageIndex}
          gap={gap}
        />
      ))}
      {isFetching && loader}
      <div ref={lastItemRef} />
    </Stack>
  );
};

const RenderItems = memo(
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
    const [isVisible, setIsVisible] = useState(true);
    const [height, setHeight] = useState<number | null>(null);
    const ref = useRef<HTMLDivElement>(null);

    useEffect(() => {
      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            setIsVisible(entry.isIntersecting);
          });
        },
        { threshold: 0 } // Adjust threshold as needed
      );

      if (ref.current) {
        observer.observe(ref.current);
      }

      return () => {
        if (ref.current) {
          observer.unobserve(ref.current);
        }
      };
    }, []);

    useEffect(() => {
      if (ref.current) {
        const height = ref.current.clientHeight;
        console.log('height', height);
        setHeight(height);
      }
    }, [items]);

    return (
      <Stack
        ref={ref}
        gap={gap}
        style={{
          height: isVisible ? 'auto' : height ? `${height}px` : '100px',
        }}
      >
        <Show when={isVisible}>
          {items.map((item, index) => renderItem(item, pageIndex * 10 + index))}
        </Show>
      </Stack>
    );
  }
);

export default InfiniteScroll;
