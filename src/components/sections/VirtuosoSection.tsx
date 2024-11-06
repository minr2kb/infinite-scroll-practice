import { Virtuoso } from 'react-virtuoso';
import FeedCard from '../FeedCard';
import { useAtomValue } from 'jotai';
import { fetchDelayAtom, paginationLimitAtom } from '@/states';
import { useState, useCallback, useEffect } from 'react';
import { Box } from '@chakra-ui/react';

const VirtuosoSection = () => {
  const fetchDelay = useAtomValue(fetchDelayAtom);
  const paginationLimit = useAtomValue(paginationLimitAtom);
  const [items, setItems] = useState<{ content: string }[]>([]);

  const loadMore = useCallback(async () => {
    const page = Math.floor(items.length / paginationLimit) + 1;
    await new Promise((resolve) => setTimeout(resolve, fetchDelay));
    const newItems = Array.from({ length: paginationLimit }, (_, index) => ({
      content: `${(page - 1) * paginationLimit + index + 1}`,
    }));

    setItems((prev) => [...prev, ...newItems]);
  }, [fetchDelay, paginationLimit, items.length]);

  const renderItem = (index: number) => {
    const item = items[index];
    const hasImage = index % 2 === 0;
    const contentLength = (index % 161) + 10;
    return (
      <Box css={{ pb: 4 }}>
        <FeedCard
          username={`Dynamic ${item.content}`}
          avatarSrc="https://images.unsplash.com/photo-1511806754518-53bada35f930"
          userId="@minr2_kb"
          imageSrc={hasImage ? 'https://picsum.photos/200/300' : undefined}
          description={'This is the card body. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Curabitur nec odio vel dui euismod fermentum. Curabitur nec odio vel dui euismod fermentum.'.substring(
            0,
            contentLength
          )}
        />
      </Box>
    );
  };

  useEffect(() => {
    loadMore();
  }, []);

  return (
    <Virtuoso
      useWindowScroll
      data={items}
      endReached={loadMore}
      overscan={200}
      itemContent={(index) => renderItem(index)}
      components={{
        Footer: () => <FeedCard loading />,
      }}
    />
  );
};

export default VirtuosoSection;
