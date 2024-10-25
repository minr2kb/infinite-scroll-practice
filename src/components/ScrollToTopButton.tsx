import { IconButton } from '@chakra-ui/react';
import { BiArrowToTop } from 'react-icons/bi';

const ScrollToTopButton = () => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };
  return (
    <IconButton
      aria-label="Scroll to top"
      position="fixed"
      bottom={4}
      right={4}
      onClick={scrollToTop}
      // colorPalette="teal"
      borderRadius="full"
    >
      <BiArrowToTop />
    </IconButton>
  );
};

export default ScrollToTopButton;
