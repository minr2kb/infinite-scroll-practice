# Infinite Scroll 연습 (WIP)

이 프로젝트는 무한 스크롤 기능을 테스트 하기 위한 React 애플리케이션입니다. 타 라이브러리 비교 및 virtualizer 직접 구현을 목표로 제작되었습니다.

## 1. 프로젝트 정보

### 1.1 기술 스택

- React 18
- TypeScript
- Chakra UI 3
- Tanstack Query
- Vite

### 1.2 시작하기

1. 의존성 설치

```bash
yarn install
```

2. 개발 서버 시작

```bash
yarn dev
```

## 2. 구현 상세

### 2.1 VirtualizedInfiniteScrollV2 알고리즘

#### 데이터 페칭 및 관리

1. **무한 쿼리 설정**
   ```typescript
   const { hasNextPage, isFetching, fetchNextPage, data } = useInfiniteQuery({
     queryKey: ['items'],
     queryFn: ({ pageParam = 1 }) => fetchData(pageParam),
     getNextPageParam: (lastPage, pages) =>
       lastPage.length ? pages.length + 1 : undefined,
     select: (data) => data.pages.flatMap((page) => page),
   });
   ```
   - Tanstack Query로 페이지 단위 데이터 관리
   - 데이터 구조 최적화를 위한 select 옵션 사용

#### 가상화 (Virtualization) 구현

1. **높이 관리 시스템**

   ```typescript
   const heightCacheRef = useRef<number[]>([]);

   const measureItem = useCallback((index: number, element: HTMLDivElement) => {
     const height = element.getBoundingClientRect().height;
     if (heightCacheRef.current[index] !== height) {
       heightCacheRef.current[index] = height;
       updateTotalHeight();
     }
   }, []);
   ```

   - 동적 높이 측정 및 캐싱

2. **가시 영역 계산**

   ```typescript
   const visibleRange = useMemo(() => {
     const startIndex = getIndexAtOffset(scrollTop - overscan);
     const endIndex = getIndexAtOffset(scrollTop + windowHeight + overscan);

     return {
       start: Math.max(0, startIndex),
       end: Math.min(data.length, endIndex + 1),
     };
   }, [scrollTop, windowHeight, overscan]);
   ```

   - 현재 스크롤 위치 기반 계산
   - overscan으로 버퍼 영역 확보

#### 무한 스크롤 구현

1. **교차점 관찰**

   ```typescript
   const { isIntersecting, ref: lastItemRef } = useIntersectionObserver();

   useEffect(() => {
     if (isIntersecting && hasNextPage) {
       fetchNextPage();
     }
   }, [isIntersecting, hasNextPage]);
   ```

   - IntersectionObserver로 추가 데이터 로드 트리거

2. **최적화된 렌더링**

   - 필요한 아이템만 선택적 렌더링
   - 절대 위치로 성능 최적화

#### 성능 최적화 전략

1. **이진 검색을 통한 인덱스 계산**

   ```typescript
   const getIndexAtOffset = useCallback(
     (offset: number): number => {
       let low = 0;
       let high = data.length;

       while (low < high) {
         const mid = (low + high) >>> 1;
         if (getTopOffset(mid) <= offset) low = mid + 1;
         else high = mid;
       }
       return low > 0 ? low - 1 : 0;
     },
     [data.length]
   );
   ```

   - O(log n) 시간 복잡도로 스크롤 성능 최적화

### 2.2 사용 예시

```typescript
const MyComponent = () => {
  const fetchData = async (page: number) => {
    const response = await fetch(`/api/items?page=${page}`);
    return response.json();
  };

  return (
    <VirtualizedInfiniteScrollV2
      fetchData={fetchData}
      renderItem={(item) => <ItemCard {...item} />}
      loader={<Spinner />}
    />
  );
};
```

## 3. 개선 사항

### 3.1 현재 한계점

#### 성능 관련

- **높이 측정**
  - 모든 아이템의 개별 높이 측정으로 인한 오버헤드
  - 불필요한 리렌더링 발생
  - 탭 전환시 블로킹 발생 가능
- **스크롤 성능**
  - 빈번한 스크롤 이벤트로 인한 성능 저하
  - 큰 데이터셋에서의 지연 발생

#### 사용성 관련

- **스크롤 위치 보존**
  - 탭 전환/새로고침 시 스크롤 위치 손실
  - 브라우저 뒤로가기 시 상태 복원 불가
- **접근성**
  - 키보드 네비게이션 미흡
  - 스크린 리더 지원 부족

### 3.2 개선 계획

- 탭 내의 스크롤 위치 기억하기 (sessionStorage 활용)
- 탭 간 전환시의 스크롤 위치 변경 로직
- ARIA 속성 추가
- 키보드 인터랙션 구현
- 높이 예측 알고리즘 도입
- LRU 캐시 구현 및 메모리 관리 개선
- 탭 컴포넌트 useTransition 적용

## 4. 작성자

- 민경배
- kbmin1129@gmail.com
