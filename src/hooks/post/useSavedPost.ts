import { useFragment, useMutation } from "@apollo/client/react";
import { SAVED_POST_QUERY } from "@/graphql/query";
import { SAVED_POST, REMOVE_SAVED_POST } from "@/graphql/mutation";
import type { SavedPostProps } from "@/pages/savedItems/SavedItems";
import { gql } from "@apollo/client";
import type { PostType } from "@/components/features/post/types";

const POST_SAVED_FRAGMENT = gql`
  fragment PostSaved on Post {
    isSaved
  }
`;
type FragmentProps = {
  isSaved: boolean;
}

export const useSavedPost = (data: PostType) => {
  const { data: fragmentData } = useFragment<FragmentProps>({
    fragment: POST_SAVED_FRAGMENT,
    from: { __typename: 'Post', id: data.id }
  })
  const isSaved = fragmentData?.isSaved ?? data.isSaved ?? false;

  const [Saved_Post] = useMutation(SAVED_POST, {
    update: (cache) => {
      cache.updateQuery({ query: SAVED_POST_QUERY }, (existing: SavedPostProps | null) => {
        const current = existing?.getSavedPosts ?? [];
        const alreadyExists = current.some((p: any) => p.id === data.id);
        if (alreadyExists) return existing;
        return { getSavedPosts: [data, ...current] };
      });
      cache.modify({
        id: cache.identify({ __typename: 'Post', id: data.id }),
        fields: { isSaved: () => true }
      });
    }
  });

  const [Remove_Saved_Post] = useMutation(REMOVE_SAVED_POST, {
    update: (cache) => {
      cache.modify({
        id: cache.identify({ __typename: 'Post', id: data.id }),
        fields: {
          isSaved: () => false
        }
      });
      cache.updateQuery({ query: SAVED_POST_QUERY }, (existing: SavedPostProps | null) => ({
        getSavedPosts: (existing?.getSavedPosts ?? []).filter((p: any) => p.id !== data.id)
      }));
    }
  });

  const toggleSaved = async () => {
    const id = data.clientId || data.id;
    if (isSaved) {
      await Remove_Saved_Post({ variables: { postId: id } });
    } else {
      await Saved_Post({ variables: { postId: id } });
    }
  };

  return { isSaved, toggleSaved };
};