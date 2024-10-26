import { EmptyState } from '../ui/empty-state';
import { BiNoEntry } from 'react-icons/bi';
const FourthSection = () => {
  return (
    <EmptyState
      title="No Content"
      description="No content found"
      icon={<BiNoEntry />}
    />
  );
};

export default FourthSection;
