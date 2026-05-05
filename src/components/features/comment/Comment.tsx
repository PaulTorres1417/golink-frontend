import { styled } from "styled-components";
import { useLocation, useNavigate } from "react-router-dom";
import { useMutation } from "@apollo/client/react";
import { useTheme } from '@/store/theme';
import { dayjs } from '@/utils';
import { PostDetailAction } from "../post/detail/PostDetailAction";
import type { CommentType } from "./types";
import { CREATE_VIEW_COMMENT } from "@/graphql/mutation";
import { getDisplayName } from "@/utils/user/user";
import { Avatar } from "@/components/ui";

export const Comment = ({ comment, post }: CommentType) => {
  const { user_id, content, created_at, has_viewed } = comment;
  const { theme } = useTheme();
  const navigate = useNavigate();
  const location = useLocation();
  const [create_view_comment] = useMutation(CREATE_VIEW_COMMENT);

  const handleComment = (commentId: string) => {
    const originalPost = location.state?.postData || post;
    if (!has_viewed) {
      create_view_comment({
        variables: { commentId }
      });
    }

    const existingAncestors = location.state?.ancestorComments || [];
    const newAncestors = [...existingAncestors, comment];

    navigate(`/home/post/${post?.id}/comment/${commentId}`, {
      state: {
        postData: originalPost,
        commentData: {
          kind: 'Comment' as const,
          ...comment
        },
        ancestorComments: newAncestors.map(ancestor => ({
          kind: 'Comment' as const,
          ...ancestor
        }))
      }
    });
  };

  return (
    <Container $themeMode={theme} onClick={() => handleComment(comment.id)}>
      <Main>
        <Avatar avatarUrl={user_id.avatar}/>
        <TextContent>
          <UserName>
            <div><p>{getDisplayName(user_id.name)}</p></div>
            <Email $themeMode={theme}>@{user_id.email ? user_id.email.split("@")[0] : "anonimus"}</Email>
            <Time $themeMode={theme}>&middot;<span>{dayjs(created_at).fromNow(true)}</span></Time>
          </UserName>
          <CommentText $themeMode={theme}>{content}</CommentText>
          <PostDetailAction comment={comment} />
        </TextContent>
      </Main>
    </Container>
  );
};

const Container = styled.div<{ $themeMode: string }>`
  width: 100%;
  max-width: 100%;
  padding: 10px 12px 0px 12px;
  display: flex;
  flex-direction: column;
  cursor: pointer;
  border-bottom: ${({ $themeMode }) => $themeMode === 'dark'
    ? '1px solid #6f778b52'
    : '1px solid rgba(197, 197, 197, 0.41)'}; 
  transition: background-color 0.2s ease;
`;

const Main = styled.div`
  display: flex;
  align-items: flex-start;
  gap: 8px;
  width: 100%;
`;

const TextContent = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
`;

const Email = styled.div<{ $themeMode: string }>`
  color: ${({ $themeMode }) =>
  ($themeMode === 'dark'
    ? '#8698c4ff'
    : 'rgba(83, 100, 113, 1)')};
`;

const UserName = styled.div`
  font-size: 15px;
  display: flex;
  gap: 5px;

  p { font-weight: bold }
`;

const CommentText = styled.p<{ $themeMode: string }>`
  margin: 5px 0 0;
  font-size: 15px;
  color: ${({ $themeMode }) => ($themeMode === 'dark' ? '#ffffffff' : '#555')}
`;

const Time = styled.div<{ $themeMode: string }>`
  color: ${({ $themeMode }) =>
  ($themeMode === 'dark'
    ? '#8698c4ff'
    : 'rgba(83, 100, 113, 1)')};

  span { margin-left: 3px }
`;