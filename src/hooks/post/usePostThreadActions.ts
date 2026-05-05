import { useState } from "react";
import { useFragment, useSubscription } from "@apollo/client/react";
import { gql } from "@apollo/client";
import { usePostStore } from "@/store/post";
import { POST_REPOST_COUNT_SUBSCRIPTION } from "@/graphql/subcription";
import type { CommentType, PostRepostCount, PostType } from "@/components/features/post/types";
import { useShallow } from 'zustand/react/shallow'; 

const COMMENT_COUNT_FRAGMENT = gql`
  fragment CommentCountFields on Comment {
    comments
  }
`;

type CommentCountProps = {
  comments: number;
}


export const usePostThreadActions = (post: PostType | CommentType, statePost: boolean) => {
  const [isRepostOpen, setIsRepostOpen] = useState(false);
  const updatePostFields = usePostStore((state) => state.updatePostFields);

  const { postCommentCount, repostCount } = usePostStore(
    useShallow((state) => {
      const found = state.posts.find(p => p.id === post.id || p.clientId === post.id);
      return {
        postCommentCount: statePost ? (found?.comments ?? post.comments) : null,
        repostCount: found?.count_repost ?? post.count_repost,
      };
    })
  );

  const { data, complete } = useFragment<CommentCountProps>({
    fragment: COMMENT_COUNT_FRAGMENT,
    from: { __typename: 'Comment', id: post.id },
  });

  const commentCount = statePost
    ? postCommentCount
    : complete ? data?.comments : post.comments;

  const isRepost = post.isRepost;

  const source = {
    type: post.kind === 'Post' ? 'post' : 'comment',
    payload: post
  };

  useSubscription<PostRepostCount>(POST_REPOST_COUNT_SUBSCRIPTION, {
    onData: ({ data }) => {
      const postRepostData = data.data?.postRepost;
      if (!postRepostData) return;
      if (postRepostData.id === (post as PostType).id) {
        updatePostFields(postRepostData.id, { count_repost: postRepostData.count_repost });
      }
    }
  });

  return {
    isRepostOpen,
    setIsRepostOpen,
    commentCount,
    repostCount,
    isRepost,
    source,
  };
};