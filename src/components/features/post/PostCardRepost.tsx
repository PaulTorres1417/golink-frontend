import styled from "styled-components";
import { FaUserCircle } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { useTheme } from "@/store/theme";
import { PostFeedVideo } from "./PostFeedVideo";
import type { Post } from "./types";
import type { CommentProps } from "@/pages/post/types";

type Props = {
  original_post: Post | null;
  original_comment: CommentProps | null;
}

export const RepostCard = ({ original_post, original_comment }: Props) => {
  const navigate = useNavigate();
  const { theme } = useTheme();
  if (!original_post && !original_comment) return null;

  const data = original_post ?? original_comment!;

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();

    if (original_post) {
      navigate(`post/${original_post.id}`, {
        state: {
          postData: {
            kind: 'Post' as const,
            ...original_post,
            clientId: original_post.id,
            original_post: null,
            original_comment: null,
            initialReaction: false,
            has_viewed: false,
            isSaved: false,
            isRepost: false,
            comments: 0,
            view_count: 0,
            count_repost: 0,
            countReaction: 0,
          }
        }
      })
    } else if (original_comment) {
      navigate(`post/${original_comment.post_id.id}/comment/${original_comment.id}`, {
        state: {
          commentData: { kind: 'Comment' as const, ...original_comment },
          postData: original_comment.post_id
        }
      })
    }
  }
  return (
    <Card onClick={handleClick}>
      <Header>
        <Avatar>
          {data.user_id.avatar
            ? <img src={data.user_id.avatar} alt="avatar" />
            : <FaUserCircle size={18} />}
        </Avatar>
        <Name>{data.user_id.name}</Name>
        <Handle>@{data.user_id.email?.split("@")[0]}</Handle>
      </Header>
      <Content>{data.content}</Content>
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

const Avatar = styled.div`
  width: 20px;
  height: 20px;
  border-radius: 50%;
  overflow: hidden;
  flex-shrink: 0;
  display: flex;
  align-items: center;
  color: rgba(113, 118, 123, 1);

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
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
    max-height: 280px;
    object-fit: cover;
    display: block;
    border-radius: 10px;
  }
`;