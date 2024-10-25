import {
  Box,
  Container,
  For,
  Heading,
  Highlight,
  Separator,
  Tabs,
  Text,
  VStack,
  IconButton,
} from '@chakra-ui/react';
import { ColorModeButton } from '@/components/ui/color-mode';
import FirstSection from '@/components/sections/FirstSection';
import SecondSection from '@/components/sections/SecondSection';
import ThirdSection from '@/components/sections/ThirdSection';
import { BiArrowToTop } from 'react-icons/bi';
import { Slider } from './components/ui/slider';

const tabs = [
  {
    label: 'Virtualized',
    value: 'tab-1',
    component: <FirstSection />,
  },
  {
    label: 'Finite',
    value: 'tab-2',
    component: <SecondSection count={10} />,
  },
  {
    label: 'Empty',
    value: 'tab-3',
    component: <ThirdSection />,
  },
];

function App() {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <Container centerContent>
      <VStack gap={4} maxW="lg" w="100%" alignItems="flex-start" p={[2, 4]}>
        <Heading size="4xl" mt={10}>
          Infinite Scroll
        </Heading>
        <Separator />
        <Text>
          <Highlight
            query="Infinite scroll"
            styles={{ px: '0.5', bg: 'teal.muted', fontWeight: 'semibold' }}
          >
            Infinite scroll is a common UI pattern used to load content
            incrementally as the user scrolls.
          </Highlight>
        </Text>

        <Tabs.Root
          lazyMount
          unmountOnExit
          defaultValue={tabs[0].value}
          w={'full'}
          mt={10}
        >
          <Tabs.List
            css={{
              position: 'sticky',
              top: 0,
              left: 0,
              zIndex: 1,
              bgColor: 'Background',
            }}
          >
            <For each={tabs}>
              {(tab) => (
                <Tabs.Trigger
                  justifyContent={'center'}
                  w={'full'}
                  value={tab.value}
                  key={tab.value}
                >
                  {tab.label}
                </Tabs.Trigger>
              )}
            </For>
          </Tabs.List>
          <For each={tabs}>
            {(tab) => (
              <Tabs.Content key={tab.value} value={tab.value}>
                {tab.component}
              </Tabs.Content>
            )}
          </For>
        </Tabs.Root>
      </VStack>
      <Box position="fixed" top={4} right={4}>
        <ColorModeButton variant={'outline'} />
      </Box>
      <IconButton
        aria-label="Scroll to top"
        position="fixed"
        bottom={4}
        right={4}
        onClick={scrollToTop}
        colorScheme="teal"
        borderRadius="full"
      >
        <BiArrowToTop />
      </IconButton>
    </Container>
  );
}

export default App;
