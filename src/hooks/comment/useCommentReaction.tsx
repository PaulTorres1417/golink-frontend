import { useFragment, useMutation } from "@apollo/client/react";
import { gql } from "@apollo/client";

const CREATE_REACTION = gql`
  mutation create_reaction_comment($commentId: ID!) {
    createCommentReaction(commentId: $commentId)
  }
`;

const DELETE_REACTION = gql`
  mutation delete_reaction_comment($commentId: ID!) {
    deleteCommentReaction(commentId: $commentId)
  }
`;

const COMMENT_REACTION_FRAGMENT = gql`
  fragment CommentReactionFields on Comment {
    initialReaction
    reactions
  }
`;

type CommentReactionProps = {
  commentId: string;
  initialReaction: boolean;
  reactions: number;
}

export const useCommentReaction = (
  commentId: string,
  initialReaction: boolean,
  initialCount: number
) => {
  
  const { data, complete } = useFragment<CommentReactionProps>({
    fragment: COMMENT_REACTION_FRAGMENT,
    from: { __typename: 'Comment', id: commentId },
  });

  const reaction = complete ? data?.initialReaction : initialReaction;
  const count = complete ? data?.reactions : initialCount;

  const [create_reaction_comment] = useMutation(CREATE_REACTION, {
    optimisticResponse: {
      createCommentReaction: true
    },
    update: (cache) => {
      cache.modify({
        id: cache.identify({ __typename: 'Comment', id: commentId }),
        fields: {
          initialReaction: () => true,
          reactions: (existingCount: number = 0) => existingCount + 1 
        },
      });
    }
  });

  const [delete_reaction_comment] = useMutation(DELETE_REACTION, {
    optimisticResponse: {
      deleteCommentReaction: true
    },
    update: (cache) => {
      cache.modify({
        id: cache.identify({ __typename: 'Comment', id: commentId }),
        fields: {
          initialReaction: () => false,
          reactions: (existingCount: number = 0) => Math.max(existingCount - 1, 0) 
        }
      });
    }
  });

  const onToggle = async () => {
    try {
      if (reaction) {
        await delete_reaction_comment({ variables: { commentId } });
      } else {
        await create_reaction_comment({ variables: { commentId } });
      }
    } catch (error) {
      console.error('Error toggle reaction:', error);
    }
  };

  return { reaction, count, onToggle };
};