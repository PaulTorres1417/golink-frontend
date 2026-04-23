import styled from "styled-components";
import { useTheme, usePostStore } from '@/store';
import type { PostQueryProps } from "./types";
import { HeartButton } from '@/components/ui';
import { useSavedPost, usePostReaction } from '@/hooks/post';
import { useState } from "react";
import { RepostModalPost } from "./modals/RepostModalPost";
import { CommentIcon, ViewsIcon, RepostIcon } from '@/components/ui';
import { FiBookmark } from "react-icons/fi";
import { FaBookmark } from "react-icons/fa";
import toast from "react-hot-toast";

interface PostIdProps {
  data: PostQueryProps;
  initialReaction: boolean;
}

export const PostActions = ({ data, initialReaction }: PostIdProps) => {
  const [isRepostOpen, setIsRepostOpen] = useState<boolean>(false);
  const { theme } = useTheme();

  const commentCount = usePostStore((state) => {
    const currentPost = state.posts.find(post => post.id === data.id);
    return currentPost?.comments ?? data.comments;
  });

  const { isSaved, toggleSaved } = useSavedPost({ ...data, kind: 'Post' });

  const { reaction, count, onToggle } = usePostReaction(
    data.id,
    initialReaction,
    data.countReaction || 0
  );

  const source = {
    type: "post",
    payload: {
      kind: "Post" as const,
      ...data
    }
  };

  const handleToggleSaved = async () => {
    await toggleSaved();
    toast.success(isSaved ? "It was removed from your saved items" : "It was added to your saved items", {
      icon: isSaved ? <FaBookmark size={16} /> : <FiBookmark size={16} />,
      style: {
        background: theme === "dark" ? "#fff" : "#2a3236",
        color: theme === "dark" ? "#000" : "#fff",
        fontSize: "14px"
      }
    });
  }

  return (
    <>
      <ActionsContainer onClick={(e) => e.stopPropagation()}>

        {/* comments */}
        <Action 
         className="comment" 
         $themeMode={theme}
        >
          <Inner>
            <CommentIcon size={19} />
            <Count>{commentCount > 0 ? commentCount : ''}</Count>
          </Inner>
        </Action>

        {/* reaction */}
        <HeartButton
          reaction={reaction}
          count={count}
          onToggle={onToggle}
          theme={theme}
          isColor={true}
        />

        {/* repost */}
        <Action
          className="share"
          $themeMode={theme}
          $isRepost={data.isRepost}
          onClick={() => setIsRepostOpen((prev) => !prev)}
        >
          <Inner>
            <RepostIcon size={19} />
            <Count>{data.count_repost > 0 ? data.count_repost : ''}</Count>
          </Inner>
        </Action>

        {/* views */}
        <Action className="views" $themeMode={theme}>
          <Inner>
            <ViewsIcon size={18} />
            <Count>{data.view_count > 0 ? data.view_count : ''}</Count>
          </Inner>
        </Action>

        {/* saved */}
        <Action
          className="saved"
          $themeMode={theme}
          $saved={isSaved}
          onClick={handleToggleSaved}
        >
          <Inner>
            {isSaved
              ? <FaBookmark size={18} />
              : <FiBookmark size={18} />}
          </Inner>
        </Action>

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

const ActionsContainer = styled.div`
  width: 100%;
  margin: 5px 0px;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const Inner = styled.div`
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 4px 4px;
  border-radius: 20px;

  svg {
    font-size: 20px;
  }
`;

const Count = styled.span`
  font-size: 14px;
  min-width: 16px;
  text-align: left;
  display: inline-block;
`;

const Action = styled.div<{ $themeMode: string, $saved?: boolean, $isRepost?: boolean }>`
  display: flex;
  padding: 2px 2px;
  justify-content: space-between;
  border-radius: 20px;
  cursor: pointer;
  color: ${({ $themeMode, $saved, $isRepost }) =>
    $isRepost
      ? '#0bb652ff'
      : $saved
        ? '#1870f4'
        : $themeMode === 'dark'
          ? '#a8b3cfbe'
          : 'rgba(83, 100, 113, 1)'};

  &.comment:hover ${Inner} {
    color: #1d9bf0;
  }

  &.share:hover ${Inner} {
    color: #0bb652ff;
  }

  &.views:hover ${Inner} {
    color: #f77529ff;
  }

  &.saved:hover ${Inner} {
    color: #1d9bf0;
  }
`;