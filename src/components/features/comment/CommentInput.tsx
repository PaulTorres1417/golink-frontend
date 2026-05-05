import styled from "styled-components";
import TextareaAutosize from 'react-textarea-autosize';
import type { CommentType, PostQueryProps } from "../post/types";
import { Avatar } from '@/components/ui';
import { getDisplayName } from "@/utils/user/user";
import { useCommentInput } from "@/hooks/comment/useCommentInput";

type CommentInputProps = {
  post?: PostQueryProps | CommentType;
  postId: string;
  parentCommentId?: string | null;
}

export const CommentInput = ({ post, postId, parentCommentId }: CommentInputProps) => {
  
  const { comment, handleSend, setComment, theme, user } 
  = useCommentInput({ post, postId, parentCommentId });

  return (
    <Container $theme={theme}>
      <AvatarWrapper>
        <Avatar avatarUrl={user?.avatar} />
      </AvatarWrapper>
      <InputRow>
        <FakeInput
          id="post-text"
          name="post-text"
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          placeholder={`Post your reply${!post || user?.name === post.user_id.name ? "" : ` to @${getDisplayName(post.user_id.name)}`}`}
          $themeMode={theme}
          rows={1}
        />
      </InputRow>
      <ButtonWrapper $themeMode={theme}>
        <button
          onClick={handleSend}
          disabled={!comment.trim()}
        >
          Reply
        </button>
      </ButtonWrapper>
      
    </Container>
  );
};

const Container = styled.div<{ $theme: string }>`
  width: 100%;
  display: flex;
  gap: 12px;
  align-items: flex-start;
  padding: 12px;
  border-bottom: 1px solid ${({ $theme }) =>
    $theme === 'dark'
      ? '#6f778b52'
      : 'rgba(197, 197, 197, 0.41)'};

`;

const AvatarWrapper = styled.div`
  display: flex;
  width: 48px;
  justify-content: flex-start;
  align-items: flex-start;
 
`;

const InputRow = styled.div`
  display: flex;
  flex: 1;
  align-items: stretch;
  min-width: 0;
`;

const FakeInput = styled(TextareaAutosize)<{ $themeMode: string }>`
  font-family: inherit;
  width: 100%;
  background: transparent;
  font-size: 16px;
  border: none;
  padding: 10px 0;
  margin: 0;
  outline: none;
  resize: none;
  color: ${({ $themeMode }) => ($themeMode === 'dark' ? '#fff' : '#000')};
  &::placeholder {
    color: #909296ff;
    font-size: 16px;
  }
`;

const ButtonWrapper = styled.div<{ $themeMode: string }>`
  display: flex;
  justify-content: center;
  align-items: center;
  button {
    min-width: 80px;
    height: 36px;
    background-color: #1870f4;
    color: white;
    border: none;
    border-radius: 999px;
    font-weight: bold;
    font-size: 14px;
    cursor: pointer;
    transition: background-color 0.2s;
    white-space: nowrap;
    flex-shrink: 0;

    &:hover:not(:disabled) {
      background-color: #1a8cd8;
    }

    &:disabled {
      background-color: ${({ $themeMode }) => ($themeMode === 'dark' ? '#6e6d6dff' : '#ccc')};
      color: #000;
      cursor: not-allowed;
    }
  }
  
`;