import FeedCard from '../FeedCard';
import { useAtomValue } from 'jotai';
import { fetchDelayAtom, paginationLimitAtom } from '@/states';
import VirtualizedInfiniteScroll from '../VirtualizedInfiniteScroll';

const FirstSection = () => {
  const fetchDelay = useAtomValue(fetchDelayAtom);
  const paginationLimit = useAtomValue(paginationLimitAtom);

  const fetchData = async (page: number): Promise<{ content: string }[]> => {
    await new Promise((resolve) => setTimeout(resolve, fetchDelay));
    return Array.from({ length: paginationLimit }, (_, index) => ({
      content: `${(page - 1) * paginationLimit + index + 1}`,
    }));
  };

  const renderItem = (item: { content: string }, index: number) => {
    return <FeedCard key={index} username={`Virtualized ${item.content}`} />;
  };

  return (
    <VirtualizedInfiniteScroll
      renderItem={renderItem}
      fetchData={fetchData}
      gap={4}
      loader={<FeedCard loading />}
    />
  );
};

export default FirstSection;
