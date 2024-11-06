import {
  Box,
  Container,
  For,
  Heading,
  Highlight,
  Separator,
  Tabs,
  Text,
  Flex,
  Stack,
  Status,
} from '@chakra-ui/react';
import { ColorModeButton } from '@/components/ui/color-mode';
import SelfmadeSection from '@/components/sections/SelfmadeSection';
// import TestSection from '@/components/sections/TestSection';
import VirtuosoSection from '@/components/sections/VirtuosoSection';
import EmptySection from './components/sections/EmptySection';
import ScrollToTopButton from '@/components/ScrollToTopButton';

const tabs = [
  {
    label: 'Selfmade',
    value: 'tab-1',
    component: <SelfmadeSection />,
  },
  {
    label: 'Virtuoso',
    value: 'tab-2',
    component: <VirtuosoSection />,
    hasNotification: false,
  },
  {
    label: 'Empty',
    value: 'tab-3',
    component: <EmptySection />,
    hasNotification: false,
  },
];

function App() {
  return (
    <Container centerContent bg="Background" maxW="100vw" minH="100vh">
      <Stack gap={4} maxW="lg" w="100%" alignItems="flex-start" p={[2, 4]}>
        <Flex w={'full'} justifyContent={'space-between'} mt={10}>
          <Heading size="4xl">Infinite Scroll</Heading>
          <Box>
            <ColorModeButton variant={'outline'} />
          </Box>
        </Flex>
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
          size="lg"
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
                  {tab.hasNotification && (
                    <Status.Root colorPalette="teal">
                      <Status.Indicator />
                    </Status.Root>
                  )}
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
      </Stack>
      <ScrollToTopButton />
    </Container>
  );
}

export default App;
