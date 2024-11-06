import useWindowScrollTop from '@/hooks/useWindowScrollTop';
import useWindowSize from '@/hooks/useWindowSize';
import { Box, Stack } from '@chakra-ui/react';
import { memo, useRef, useState, useEffect, useMemo, useCallback } from 'react';

type VirtualListProps<T> = {
  data: T[];
  renderItem: (item: T, index: number) => JSX.Element;
  gap?: number;
  overscan?: number;
};

const VirtualList = <T,>({
  data,
  renderItem,
  gap = 0,
  overscan = 200,
}: VirtualListProps<T>) => {
  const { scrollTop } = useWindowScrollTop();
  const { height: windowHeight = 0 } = useWindowSize();
  const heightCacheRef = useRef(new Map<number, number>());
  const [totalHeight, setTotalHeight] = useState(0);

  // 전체 높이 업데이트 최적화
  const updateTotalHeight = useCallback(() => {
    let height = 0;
    heightCacheRef.current.forEach((itemHeight) => {
      height += itemHeight + gap;
    });
    setTotalHeight(height);
  }, [gap]);

  // 높이 계산 로직 최적화
  const measureItem = useCallback(
    (index: number, element: HTMLDivElement) => {
      const height = element.getBoundingClientRect().height;
      if (heightCacheRef.current.get(index) !== height) {
        heightCacheRef.current.set(index, height);
        updateTotalHeight();
      }
    },
    [updateTotalHeight]
  );

  // 높이 누적값 캐시 추가
  const cumulativeHeightCache = useMemo(() => {
    const cache = new Map<number, number>();
    let accumHeight = 0;

    for (let i = 0; i < data.length; i++) {
      accumHeight += (heightCacheRef.current.get(i) || 0) + gap;
      cache.set(i, accumHeight);
    }
    return cache;
  }, [totalHeight, gap]);

  // 가시 범위 계산 최적화
  const visibleRange = useMemo(() => {
    const getIndexAtOffset = (offset: number) => {
      let low = 0;
      let high = data.length - 1;

      while (low <= high) {
        const mid = Math.floor((low + high) / 2);
        const midHeight = cumulativeHeightCache.get(mid) || 0;

        if (midHeight === offset) return mid;
        if (midHeight < offset) {
          low = mid + 1;
        } else {
          high = mid - 1;
        }
      }
      return low;
    };

    const startIndex = Math.max(0, getIndexAtOffset(scrollTop - overscan));
    const endIndex = Math.min(
      data.length,
      getIndexAtOffset(scrollTop + windowHeight + overscan)
    );
    console.log({ start: startIndex, end: endIndex });

    return { start: startIndex, end: endIndex };
  }, [scrollTop, overscan, data.length, windowHeight, cumulativeHeightCache]);

  // topOffset 계산 최적화
  const getTopOffset = useCallback(
    (index: number) => {
      if (index === 0) return 0;
      return cumulativeHeightCache.get(index - 1) || 0;
    },
    [cumulativeHeightCache]
  );

  const visibleData = useMemo(
    () => data.slice(visibleRange.start, visibleRange.end),
    [data, visibleRange]
  );

  return (
    <Box>
      <Stack height={`${totalHeight}px`} position="relative">
        {visibleData.map((_, index) => {
          const actualIndex = index + visibleRange.start;
          return (
            <ItemWrapper
              key={actualIndex}
              index={actualIndex}
              style={{
                position: 'absolute',
                top: `${getTopOffset(actualIndex)}px`,
                width: '100%',
              }}
              onMount={measureItem}
            >
              {renderItem(data[actualIndex], actualIndex)}
            </ItemWrapper>
          );
        })}
      </Stack>
    </Box>
  );
};

const ItemWrapper = memo(
  ({
    children,
    index,
    style,
    onMount,
  }: {
    children: React.ReactNode;
    index: number;
    style: React.CSSProperties;
    onMount: (index: number, element: HTMLDivElement) => void;
  }) => {
    const elementRef = useRef<HTMLDivElement>(null);
    const elementId = `item-${index}`;

    useEffect(() => {
      if (elementRef.current) {
        onMount(index, elementRef.current);
      }
    }, [index, onMount]);

    return (
      <Box ref={elementRef} id={elementId} style={style}>
        {children}
      </Box>
    );
  }
);

export default VirtualList;
