import InfiniteScroll from '../InfiniteScroll';
import FeedCard from '../FeedCard';

const ITEM_COUNT = 3;
const FETCH_DELAY = 300;

const FirstSection = () => {
  const fetchData = async (page: number): Promise<{ content: string }[]> => {
    await new Promise((resolve) => setTimeout(resolve, FETCH_DELAY));
    return Array.from({ length: ITEM_COUNT }, (_, index) => ({
      content: `${(page - 1) * ITEM_COUNT + index + 1}`,
    }));
  };

  const renderItem = (item: { content: string }, index: number) => {
    return <FeedCard key={index} username={`User ${item.content}`} />;
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

export default FirstSection;
