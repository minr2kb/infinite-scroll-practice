import FeedCard from '../FeedCard';
import { useAtomValue } from 'jotai';
import { fetchDelayAtom, paginationLimitAtom } from '@/states';
import VirtualizedInfiniteScroll from '../VirtualizedInfiniteScroll';

const ThirdSection = () => {
  const fetchDelay = useAtomValue(fetchDelayAtom);
  const paginationLimit = useAtomValue(paginationLimitAtom);

  const fetchData = async (page: number): Promise<{ content: string }[]> => {
    await new Promise((resolve) => setTimeout(resolve, fetchDelay));
    return Array.from({ length: paginationLimit }, (_, index) => ({
      content: `${(page - 1) * paginationLimit + index + 1}`,
    }));
  };

  const renderItem = (item: { content: string }, index: number) => {
    const hasImage = Math.random() < 0.5;
    const contentLength = Math.floor(Math.random() * 161) + 10;

    return (
      <FeedCard
        key={index}
        username={`Dynamic ${item.content}`}
        avatarSrc="https://images.unsplash.com/photo-1511806754518-53bada35f930"
        userId="@minr2_kb"
        imageSrc={hasImage ? 'https://picsum.photos/200/300' : undefined}
        description={'This is the card body. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Curabitur nec odio vel dui euismod fermentum. Curabitur nec odio vel dui euismod fermentum.'.substring(
          0,
          contentLength
        )}
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

export default ThirdSection;
