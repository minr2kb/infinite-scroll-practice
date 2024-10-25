import { EmptyState } from '../ui/empty-state';
import { BiNoEntry } from 'react-icons/bi';
const ThirdSection = () => {
  return (
    <EmptyState
      title="No Content"
      description="No content found"
      icon={<BiNoEntry />}
    />
  );
};

export default ThirdSection;
