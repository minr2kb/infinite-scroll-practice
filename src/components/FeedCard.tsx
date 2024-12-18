import {
  Card,
  HStack,
  IconButton,
  Image,
  Stack,
  Text,
  Skeleton,
  AspectRatio,
  Collapsible,
  Show,
  CardRootProps,
} from '@chakra-ui/react';
import { Avatar } from '@/components/ui/avatar';
import {
  BiDotsHorizontalRounded,
  BiHeart,
  BiMessage,
  BiShareAlt,
} from 'react-icons/bi';
import { memo, useState, forwardRef } from 'react';
import { SkeletonCircle, SkeletonText } from './ui/skeleton';
import { Input, Button } from '@chakra-ui/react';

interface FeedCardProps {
  loading?: boolean;
  avatarSrc?: string;
  username?: string;
  userId?: string;
  imageSrc?: string;
  description?: string;
}

const FeedCard = memo(
  forwardRef<HTMLDivElement, FeedCardProps & CardRootProps>(
    (
      {
        loading = false,
        avatarSrc,
        username,
        userId,
        imageSrc,
        description,
        ...cardRootProps
      },
      ref
    ) => {
      const [imageLoading, setImageLoading] = useState(true);
      const [liked, setLiked] = useState(false); // 좋아요 상태 추가
      const [showCommentInput, setShowCommentInput] = useState(false); // 코멘트 입력 창 상태 추가

      const toggleLike = () => {
        setLiked(!liked); // 좋아요 토글 함수
      };

      const toggleCommentInput = () => {
        setShowCommentInput(!showCommentInput); // 코멘트 입력 창 토글 함수
      };

      if (loading) {
        return <FeedCardSkeleton />; // FeedCardSkeleton 사용
      }

      return (
        <Card.Root w="full" ref={ref} {...cardRootProps}>
          <Card.Header>
            <HStack gap={3}>
              <Avatar src={avatarSrc} name={username} />

              <Stack gap="0" flex={1}>
                <Text fontWeight="semibold" textStyle="sm">
                  {username}
                </Text>
                <Text color="fg.muted" textStyle="xs">
                  {userId}
                </Text>
              </Stack>

              <IconButton variant="ghost">
                <BiDotsHorizontalRounded />
              </IconButton>
            </HStack>
          </Card.Header>

          <Card.Body gap="2">
            <Show when={!!imageSrc}>
              <Skeleton loading={imageLoading} rounded={'md'}>
                <AspectRatio ratio={4 / 3}>
                  <Image
                    src={imageSrc}
                    alt="feed image"
                    rounded={'md'}
                    aspectRatio={'4/3'}
                    onLoad={() => setImageLoading(false)}
                    loading="lazy"
                  />
                </AspectRatio>
              </Skeleton>
            </Show>

            <Card.Description lineClamp={3}>{description}</Card.Description>
          </Card.Body>
          <Card.Footer>
            <IconButton variant="ghost" size="sm" onClick={toggleLike}>
              <BiHeart color={liked ? 'red' : 'inherit'} />
            </IconButton>
            <IconButton variant="ghost" size="sm" onClick={toggleCommentInput}>
              <BiMessage />
            </IconButton>
            <IconButton variant="ghost" size="sm">
              <BiShareAlt />
            </IconButton>
          </Card.Footer>
          <Collapsible.Root unmountOnExit open={showCommentInput}>
            <Collapsible.Content>
              <HStack gap={0}>
                <Input variant={'subtle'} placeholder="Comment..." />
                <Button variant={'solid'} colorScheme="blue">
                  Reply
                </Button>
              </HStack>
            </Collapsible.Content>
          </Collapsible.Root>
        </Card.Root>
      );
    }
  )
);

const FeedCardSkeleton = memo(() => {
  return (
    <Card.Root w="full">
      <Card.Header>
        <HStack gap={3}>
          <SkeletonCircle height="40px" width="40px" />
          <Stack gap="0" flex={1}>
            <SkeletonText noOfLines={2} />
          </Stack>
          <IconButton variant="ghost">
            <BiDotsHorizontalRounded />
          </IconButton>
        </HStack>
      </Card.Header>
      <Card.Body gap="2">
        <Skeleton rounded={'md'} aspectRatio={'4/3'} />
        <SkeletonText noOfLines={3} />
      </Card.Body>
      <Card.Footer>
        <IconButton variant="ghost" size="sm">
          <BiHeart />
        </IconButton>
        <IconButton variant="ghost" size="sm">
          <BiMessage />
        </IconButton>
        <IconButton variant="ghost" size="sm">
          <BiShareAlt />
        </IconButton>
      </Card.Footer>
    </Card.Root>
  );
});

export default FeedCard;
