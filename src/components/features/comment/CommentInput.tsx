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
      <Avatar avatarUrl={user?.avatar} />
      <InputRow>
        <FakeInput
          id="post-text"
          name="post-text"
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          placeholder={`Post your reply${!post || user?.name === post.user_id.name
            ? ""
            : ` to @${getDisplayName(post.user_id.name)}`}
            }`}
          $themeMode={theme}
          rows={1}
        />
        <ReplyButton
          onClick={handleSend}
          $thmeMode={theme}
          disabled={!comment.trim()}
        >
          Reply
        </ReplyButton>
      </InputRow>
    </Container>
  );
};

const Container = styled.div<{ $theme: string }>`
  width: 100%;
  display: flex;
  align-items: flex-start;
  border-bottom: 1px solid ${({ $theme }) =>
    $theme === 'dark'
      ? 'rgba(132, 130, 130, 0.37)'
      : 'rgba(197, 197, 197, 0.41)'};
  padding: 14px 12px;
`;

const InputRow = styled.div`
  display: flex;
  align-items: flex-end;
  flex: 1;
  gap: 8px;
  max-width: 100%;
`;

const FakeInput = styled(TextareaAutosize) <{ $themeMode: string }>`
  flex: 1;
  font-family: inherit;
  background: transparent;
  padding: 8px 10px;
  font-size: 16px;
  border: none;
  outline: none;
  resize: none;
  color: ${({ $themeMode }) => ($themeMode === 'dark' ? '#fff' : '#000')};
  &::placeholder {
    color: #909296ff;
    font-size: 16px;
  }
`;

const ReplyButton = styled.button<{ $thmeMode: string }>`
  background-color: #1870f4;
  color: white;
  border: none;
  padding: 10px 22px;
  border-radius: 999px;
  font-weight: bold;
  font-size: 14px;
  cursor: pointer;
  transition: background-color 0.2s;
  white-space: nowrap;

  &:hover:not(:disabled) {
    background-color: #1a8cd8;
  }

  &:disabled {
    background-color: ${({ $thmeMode }) => ($thmeMode === 'dark' ? '#6e6d6dff' : '#ccc')};
    color: #000;
    cursor: not-allowed;
  }
`;