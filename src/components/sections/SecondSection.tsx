import FeedCard from '../FeedCard';
import { useAtomValue } from 'jotai';
import { fetchDelayAtom, paginationLimitAtom } from '@/states';
import InfiniteScroll from '../InfiniteScroll';

const SecondSection = () => {
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
    <InfiniteScroll
      renderItem={renderItem}
      fetchData={fetchData}
      gap={4}
      loader={<FeedCard loading />}
    />
  );
};

export default SecondSection;
