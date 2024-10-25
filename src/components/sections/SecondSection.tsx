import FeedCard from '@/components/FeedCard';
import { For, Stack } from '@chakra-ui/react';

type Props = { count: number };

const SecondSection = ({ count = 10 }: Props) => {
  return (
    <Stack gap="4" direction="row" wrap="wrap">
      <For each={Array.from({ length: count }, (_, index) => index)}>
        {(_, index) => <FeedCard key={index} />}
      </For>
    </Stack>
  );
};

export default SecondSection;
