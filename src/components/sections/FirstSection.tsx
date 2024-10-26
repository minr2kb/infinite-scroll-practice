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
    return (
      <FeedCard
        key={index}
        username={`Virtualized ${item.content}`}
        avatarSrc="https://images.unsplash.com/photo-1511806754518-53bada35f930"
        userId="@minr2_kb"
        imageSrc="https://picsum.photos/400/300"
        description="This is the card body. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Curabitur nec odio vel dui euismod fermentum. Curabitur nec odio vel dui euismod fermentum."
      />
    );
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
