import styled from "styled-components";
import { useTheme } from "@/store/theme";
import { HeartButton } from "@/components/ui";
import { SavedButton } from "../saved/SavedButton";
import { CommentIcon, RepostIcon } from "@/components/ui";
import { RepostModalPost } from "./modals/RepostModalPost";
import { usePostThreadActions, usePostReaction, useSavedPost } from '@/hooks/post';
import { useCommentReaction, useSavedComment } from '@/hooks/comment';
import type { CommentType, PostType } from "./types";

type ThreadProps = {
  post: PostType | CommentType;
  statePost: boolean;
}

type ReactionActionsProps = {
  postId: string;
  initialReaction: boolean;
  initialCount: number;
}

const PostReactionActions = ({ postId, initialReaction, initialCount }: ReactionActionsProps) => {
  const { reaction, onToggle, count } = usePostReaction(postId, initialReaction, initialCount);
  const { theme } = useTheme();
  return <HeartButton reaction={reaction} count={count} onToggle={onToggle} theme={theme} isColor={false} />;
};

const CommentReactionActions = ({ postId, initialReaction, initialCount }: ReactionActionsProps) => {
  const { reaction, onToggle, count } = useCommentReaction(postId, initialReaction, initialCount);
  const { theme } = useTheme();
  return <HeartButton reaction={reaction} count={count} onToggle={onToggle} theme={theme} isColor={false} />;
};

const CommentSaveActions = ({ data }: { data: CommentType }) => {
  const { isSaved, toggleSaved } = useSavedComment(data);
  return <SavedButton isSaved={isSaved} toggleSaved={toggleSaved} />;
};

const PostSavedActions = ({ data }: { data: PostType }) => {
  const { isSaved, toggleSaved } = useSavedPost(data);
  return <SavedButton isSaved={isSaved} toggleSaved={toggleSaved} />;
};

export const PostThreadActions = ({ post, statePost }: ThreadProps) => {
  const { theme } = useTheme();
  const {
    isRepostOpen,
    setIsRepostOpen,
    commentCount,
    repostCount,
    isRepost,
    source,
  } = usePostThreadActions(post, statePost);

  return (
    <>
      <ActionsContainer $theme={theme}>
        {/* comment */}
        <Action className="comment" $themeMode={theme}>
          <Inner>
            <CommentIcon size={22} />
            {commentCount != null && commentCount > 0 && <span>{commentCount}</span>}
          </Inner>
        </Action>

        {/* repost */}
        <Action
          className="share"
          $themeMode={theme}
          $isRepost={isRepost}
          onClick={() => setIsRepostOpen(prev => !prev)}
        >
          <Inner>
            <RepostIcon size={22} />
            {repostCount > 0 && <span>{repostCount}</span>}
          </Inner>
        </Action>

        {/* reaction */}
        {statePost
          ? <PostReactionActions
              postId={post.id}
              initialReaction={post.initialReaction}
              initialCount={post.kind === 'Post' ? post.countReaction : 0}
            />
          : <CommentReactionActions
              postId={post.id}
              initialReaction={post.initialReaction}
              initialCount={post.kind === 'Comment' ? post.reactions : 0}
            />
        }

        {/* saved */}
        {statePost && post.kind === 'Post'
          ? <PostSavedActions data={post} />
          : post.kind === 'Comment'
            ? <CommentSaveActions data={post} />
            : null
        }
      </ActionsContainer>

      {/* modal repost */}
      {isRepostOpen && (
        <RepostModalPost
          onClose={() => setIsRepostOpen(false)}
          source={source}
        />
      )}
    </>
  );
};

const ActionsContainer = styled.div<{ $theme: string }>`
  width: 100%;
  height: 50px;
  display: flex;
  padding: 0 12px;
  justify-content: space-between;
  border-bottom: 1px solid ${({ $theme }) =>
    $theme === 'dark'
      ? 'rgba(132, 130, 130, 0.37)'
      : 'rgba(197, 197, 197, 0.41)'};
`;

const Inner = styled.div`
  display: flex;
  align-items: center;
  gap: 6px;
  border-radius: 20px;
  transition: background-color 0.18s ease, color 0.18s ease;

  svg {
    font-size: 24px;
  }

  span {
    font-size: 15px;
  }
`;

const Action = styled.div<{ $themeMode: string, $isRepost?: boolean }>`
  display: flex;
  justify-content: space-between;
  align-items: center; 
  cursor: pointer;
  color: ${({ $themeMode, $isRepost }) =>
    $isRepost
      ? '#00ba7c'
      : ($themeMode === 'dark'
        ? 'rgba(113, 118, 123, 1)'
        : 'rgba(83, 100, 113, 1)')};

  &.comment:hover ${Inner} {
    color: #1d9bf0;
  }

  &.share:hover ${Inner} {
    color: #00ba7c;
  }
`;