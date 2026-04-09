import styled from "styled-components";
import { useState } from "react";
import { useSubscription } from "@apollo/client/react";
import { useTheme } from "@/store/theme";
import { useCommentReaction, useSavedComment } from "@/hooks/comment";
import { REPOST_COMMENT_COUNT } from "@/graphql/subcription";
import { CommentIcon, RepostIcon, ViewsIcon, HeartButton } from "@/components/ui";
import { RepostModalPost } from "../modals/RepostModalPost";
import { FaBookmark } from "react-icons/fa";
import { FiBookmark } from "react-icons/fi";
import type { CommentProps, CommentSubscription } from "./types";

export const PostDetailAction = ({ comment }: CommentProps) => {
  const { theme } = useTheme();
  const [isOpenModal, setIsOpenModal] = useState<boolean>(false);

  const { count, reaction, onToggle } = useCommentReaction(
    comment.id,
    comment.initialReaction,
    comment.reactions || 0
  );

  const { isSaved, toggleSaved } = useSavedComment(comment);

  const source = {
    type: "comment",
    payload: {
      kind: "Comment" as const,
      ...comment
    }
  };

  useSubscription<CommentSubscription>(REPOST_COMMENT_COUNT, {
    onData: ({ client, data }) => {
      if (!data.data?.commentRepost) return;

      const resComment = data.data.commentRepost;

      client.cache.modify({
        id: client.cache.identify({ __typename: "Comment", id: comment.id }),
        fields: {
          count_repost: () => resComment.count_repost
        }
      });
    }
  });

  return (
    <>
      <ActionsContainer onClick={(e) => e.stopPropagation()}>
        {/* Comentarios */}
        <Action className="comment" $themeMode={theme}>
          <Inner>
            <CommentIcon size={19}/>
            <Count>{comment.comments || ''}</Count>
          </Inner>
        </Action>

         {/* Like */}
        <HeartButton
          reaction={reaction}
          count={count}
          onToggle={onToggle}
          theme={theme}
          isColor={true}
        />

        {/* Repost */}
        <Action
          className="share"
          $themeMode={theme}
          $isRepost={comment.isRepost}
          onClick={() => setIsOpenModal((prev) => !prev)}
        >
          <Inner>
            <RepostIcon size={19} />
            <Count>{comment.count_repost || ""}</Count>
          </Inner>
        </Action>

        {/* Views */}
        <Action className="views" $themeMode={theme}>
          <Inner>
            <ViewsIcon size={19} />
            <Count>{comment.view_count || ''}</Count>
          </Inner>
        </Action>

        {/* Saved */}
        <SavedAction
          className="saved"
          $isSaved={isSaved}
          $hasCount={false}
          $themeMode={theme}
          onClick={toggleSaved}
        >
          <Inner>
            {isSaved
              ? <FaBookmark size={19} />
              : <FiBookmark size={19} />}
          </Inner>
        </SavedAction>

      </ActionsContainer>

      {isOpenModal && (
        <RepostModalPost
          onClose={() => setIsOpenModal(false)}
          source={source}
        />
      )}
    </>
  );
};

const ActionsContainer = styled.div`
  width: 100%;
  margin: 8px 0px;
  display: flex;
  justify-content: space-between;
`;

const Inner = styled.div`
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 4px 0px;
  border-radius: 20px;
  transition: background-color 0.18s ease, color 0.18s ease;

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

const Action = styled.div<{ $themeMode: string, $isRepost?: boolean }>`
  display: flex;
  justify-content: space-between;
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

  &.views:hover ${Inner} {
    color: #f77529ff;
  }

  &.saved:hover ${Inner} {
    color: #1870f4;
  }
`;

const SavedAction = styled(Action) <{
  $isSaved: boolean,
  $themeMode: string
  $hasCount: boolean
}>`
  color: ${({ $themeMode, $isSaved, $hasCount }) =>
    $isSaved
      ? '#1870f4'
      : $hasCount
        ? ($themeMode === 'dark'
          ? 'rgba(139, 152, 165, 1)'
          : 'rgba(83, 100, 113, 1)')
        : ($themeMode === 'dark'
          ? 'rgba(96, 106, 117, 1)'
          : 'rgba(83, 100, 113, 1)')};

  &:hover ${Inner} {
    color: #1d9bf0;
  }
`;
