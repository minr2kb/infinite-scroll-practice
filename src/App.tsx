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
import FirstSection from '@/components/sections/FirstSection';
import SecondSection from '@/components/sections/SecondSection';
import ThirdSection from '@/components/sections/ThirdSection';
import ScrollToTopButton from '@/components/ScrollToTopButton';
import FourthSection from './components/sections/FourthSection';

const tabs = [
  {
    label: 'Virtualized',
    value: 'tab-1',
    component: <FirstSection />,
    hasNotification: true,
  },
  {
    label: 'Normal',
    value: 'tab-2',
    component: <SecondSection />,
  },
  {
    label: 'Dynamic',
    value: 'tab-3',
    component: <ThirdSection />,
    hasNotification: false,
  },
  {
    label: 'Empty',
    value: 'tab-4',
    component: <FourthSection />,
    hasNotification: false,
  },
];

function App() {
  return (
    <Container centerContent bg="Background" maxW="100vw">
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
