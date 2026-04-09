import { useQuery } from "@apollo/client/react"
import { useEffect } from "react";
import type { PostQueryProps } from "../post/types";
import { SAVED_POST_QUERY } from "@/graphql/query";
import { useSavedPostStore } from "@/store/savedPosts";

export type SavedPostProps = {
  getSavedPosts: PostQueryProps[];
}

export const SavePost = ({ onReady }: { onReady?: () => void }) => {
  const { data } = useQuery<SavedPostProps>(SAVED_POST_QUERY, {
    fetchPolicy: 'network-only' 
  });
  const addSavedPosts = useSavedPostStore((state) => state.addSavedPosts);
  const removeSavedPost = useSavedPostStore((state) => state.removeSavedPost);

  useEffect(() => {
    if (!data?.getSavedPosts) return;
    const serverIds = new Set(data.getSavedPosts.map(p => p.id));
    const storeIds = new Set(useSavedPostStore.getState().savedPost.map(p => p.id));
    addSavedPosts(data.getSavedPosts);

    storeIds.forEach(id => {
      if (!serverIds.has(id)) removeSavedPost(id);
    });
    onReady?.();
  }, [data]);

  return null;
};
