import useWindowScrollTop from '@/hooks/useWindowScrollTop';
import useWindowSize from '@/hooks/useWindowSize';
import { Box, Stack } from '@chakra-ui/react';
import { memo, useRef, useState, useEffect, useMemo, useCallback } from 'react';

type VirtualListProps<T> = {
  data: T[];
  renderItem: (item: T, index: number) => JSX.Element;
  overscan?: number;
};

const VirtualList = <T,>({
  data,
  renderItem,
  overscan = 200,
}: VirtualListProps<T>) => {
  const { scrollTop } = useWindowScrollTop();
  const { height: windowHeight = 0 } = useWindowSize();
  const heightCacheRef = useRef<number[]>([]);
  const [totalHeight, setTotalHeight] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const containerTopRef = useRef<number>(0);

  // 전체 높이 업데이트 최적화
  const updateTotalHeight = useCallback(() => {
    let height = 0;
    heightCacheRef.current.forEach((itemHeight) => {
      height += itemHeight;
    });
    setTotalHeight(height);
  }, []);

  // 높이 계산 로직 최적화
  const measureItem = useCallback(
    (index: number, element: HTMLDivElement) => {
      console.log(`index: ${index}`);
      const height = element.getBoundingClientRect().height;
      if (heightCacheRef.current[index] !== height) {
        heightCacheRef.current[index] = height;
        updateTotalHeight();
      }
    },
    [updateTotalHeight]
  );

  // 높이 누적값 캐시 추가
  const cumulativeHeightCache = useMemo(() => {
    const cache = new Map<number, number>();
    let accumHeight = 0;

    for (let i = 0; i < heightCacheRef.current.length; i++) {
      accumHeight += heightCacheRef.current[i] || 0;
      cache.set(i, accumHeight);
    }
    return cache;
  }, [totalHeight]);

  // topOffset 계산 최적화
  const getTopOffset = useCallback(
    (index: number) => {
      if (index === 0) return 0;
      return cumulativeHeightCache.get(index - 1) || 0;
    },
    [cumulativeHeightCache]
  );

  const getIndexAtOffset = useCallback(
    (offset: number) => {
      let low = 0;
      let high = data.length - 1;

      while (low <= high) {
        const mid = Math.floor((low + high) / 2);
        const midHeight = cumulativeHeightCache.get(mid) || 0;

        if (midHeight === offset) return mid;
        if (midHeight < offset) {
          if (midHeight === 0) high = mid - 1;
          else low = mid + 1;
        } else {
          high = mid - 1;
        }
      }
      return low;
    },
    [cumulativeHeightCache]
  );

  // 가시 범위 계산 최적화
  const visibleRange = useMemo(() => {
    const startOffset = scrollTop - containerTopRef.current - (overscan || 0);
    const endOffset =
      scrollTop - containerTopRef.current + windowHeight + (overscan || 0);
    const startIndex = Math.max(0, getIndexAtOffset(startOffset));
    const endIndex = Math.min(data.length, getIndexAtOffset(endOffset) + 1);

    return {
      start: startIndex,
      end: Math.max(endIndex, startIndex + 1),
    };
  }, [scrollTop, overscan, data.length, windowHeight, cumulativeHeightCache]);

  const visibleData = useMemo(
    () => data.slice(visibleRange.start, visibleRange.end || 3),
    [data, visibleRange]
  );

  // 컨테이너 위치 확인을 위한 함수
  const getContainerPosition = useCallback(() => {
    if (containerRef.current) {
      containerTopRef.current =
        containerRef.current.getBoundingClientRect().top + window.scrollY;
    }
  }, []);

  // 필요한 시점에 위치 확인 (예: 마운트 시)
  useEffect(() => {
    getContainerPosition();
  }, [getContainerPosition]);

  return (
    <Stack ref={containerRef} height={`${totalHeight}px`} position="relative">
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
    }, [onMount]);

    return (
      <Box ref={elementRef} id={elementId} style={style}>
        {children}
      </Box>
    );
  }
);

export default VirtualList;
