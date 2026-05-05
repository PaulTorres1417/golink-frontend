import styled from "styled-components";
import { PostFeedVideo } from "./PostFeedVideo";
import type { Post } from "./types";
import type { CommentProps } from "@/pages/post/types";
import { useRepost } from "@/hooks/repost/useRepost";
import { Avatar } from "@/components/ui";
import { useTheme } from "@/store";

type Props = {
  original_post: Post | null;
  original_comment: CommentProps | null;
}

export const RepostCard = ({ original_post, original_comment }: Props) => {
  const { theme } = useTheme();
  const { handleClick } = useRepost({ post: original_post, comment: original_comment });
  const data = original_post ?? original_comment;

  if (!data) return null;

  return (
    <Card onClick={handleClick}>
      <Header>
        <Avatar avatarUrl={data.user_id.avatar} />
        <Name>{data?.user_id.name}</Name>
        <Handle>@{data?.user_id.email?.split("@")[0]}</Handle>
      </Header>
      <Content>{data?.content}</Content>
      {original_post?.media && (
        <Media>
          {original_post.media.media_type === 'video' ? (
            <PostFeedVideo
              src={original_post.media.url}
              theme={theme}
              variant="compact"
              autoPlay={false}
            />
          ) : (
            <img src={original_post.media.url} alt="repost media" />
          )}
        </Media>
      )}
    </Card>
  );
};

const Card = styled.div`
  margin: 10px 6px;
  border: 1px solid rgba(113, 118, 123, 0.3);
  border-radius: 14px;
  padding: 12px 14px;
  cursor: pointer;
  transition: background 0.15s ease;

  &:hover {
    background: rgba(113, 118, 123, 0.08);
  }
`;

const Header = styled.div`
  display: flex;
  align-items: center;
  gap: 6px;
  margin-bottom: 6px;
`;

const Name = styled.span`
  font-size: 14px;
  font-weight: 700;
`;

const Handle = styled.span`
  font-size: 14px;
  color: rgba(113, 118, 123, 1);
`;

const Content = styled.p`
  font-size: 14px;
  line-height: 20px;
  margin: 0 0 8px 0;
`;

const Media = styled.div`
  border-radius: 10px;
  overflow: hidden;
  margin-top: 8px;

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    display: block;
    border-radius: 10px;
  }
`;