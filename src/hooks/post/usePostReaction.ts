import { useMutation } from "@apollo/client/react";
import { gql } from "@apollo/client";
import { usePostStore } from "@/store/post";

const CREATE_REACTION = gql`
    mutation create_reaction_post($postId: ID!) {
        createPostReaction(postId: $postId)
    }
`;
const DELETE_REACTION = gql`
    mutation delete_reaction_post($postId: ID!) {
        deletePostReaction(postId: $postId)
    }
`;

export const usePostReaction = (postId: string, initialReaction: boolean, initialCount: number) => {
  const posts = usePostStore((state) => state.posts);
  const updatePostFields = usePostStore((state) => state.updatePostFields);

  const currentPost = posts.find(post => post.id === postId);
  const count = currentPost ? currentPost.countReaction : initialCount;
  const reaction = currentPost ? currentPost.initialReaction : initialReaction;
  const realPostId = currentPost?.clientId || postId;

  const [create_reaction_post] = useMutation(CREATE_REACTION);
   
  const [delete_reaction_post] = useMutation(DELETE_REACTION);

  const onToggle = async () => {
    const newReaction = !reaction;
    const newCount = reaction ? count - 1 : count + 1;

    try {
      updatePostFields(postId, {
        initialReaction: newReaction,
        countReaction: newCount
      });
      if (reaction) {
        await delete_reaction_post({ variables: { postId: realPostId } });
      } else {
        await create_reaction_post({ variables: { postId: realPostId } })
      }
    } catch (error) {
      console.error('Error toggle actions', error);
    }
  }
  return { reaction, count, onToggle }
}