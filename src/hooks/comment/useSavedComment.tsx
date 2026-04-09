import { useFragment, useMutation } from "@apollo/client/react";
import type { SavedCommentProps } from "@/pages/savedItems/SavedItems";
import type { CommentProps } from "@/pages/post/types";
import { toast } from "react-hot-toast";
import { gql } from "@apollo/client";
import { SAVED_COMMENT_QUERY } from "@/graphql/query";
import { SAVED_COMMENT, REMOVE_SAVED_COMMENT } from "@/graphql/mutation";
import { FiBookmark } from "react-icons/fi";
import { HiCheckCircle } from "react-icons/hi";

const COMMENT_SAVED_FRAGMENT = gql`
  fragment CommentSaved on Comment {
    isSaved
  }
`;

type FragmentProps = {
  isSaved: boolean;
};

export const useSavedComment = (data: CommentProps) => {
  const { data: fragmentData } = useFragment<FragmentProps>({
    fragment: COMMENT_SAVED_FRAGMENT,
    from: { __typename: 'Comment', id: data.id }
  });

  const isSaved = fragmentData?.isSaved ?? data.isSaved ?? false;

  const [Saved_Comment] = useMutation(SAVED_COMMENT, {
    update: (cache) => {
      cache.updateQuery({ query: SAVED_COMMENT_QUERY }, (existing: SavedCommentProps | null) => {
        const current = existing?.getSavedComment ?? [];
        const alreadyExists = current.some((p: any) => p.id === data.id);
        if (alreadyExists) return existing;
        return { getSavedComment: [data, ...current] };
      });

      cache.modify({
        id: cache.identify({ __typename: 'Comment', id: data.id }),
        fields: { isSaved: () => true }
      });
    }
  });

  const [Remove_Saved_Comment] = useMutation(REMOVE_SAVED_COMMENT, {
    update: (cache) => {
      cache.modify({
        id: cache.identify({ __typename: 'Comment', id: data.id }),
        fields: {
          isSaved: () => false
        }
      });

      cache.updateQuery({ query: SAVED_COMMENT_QUERY }, (existing: SavedCommentProps | null) => ({
        getSavedComment: (existing?.getSavedComment ?? []).filter((p: any) => p.id !== data.id)
      }));
    }
  });

  const toggleSaved = async () => {
    if (isSaved) {
      await Remove_Saved_Comment({ variables: { commentId: data.id } });

      toast.success("Se eliminó de tus elementos guardados", {
        icon: <HiCheckCircle size={16} color="#3676c0ff" />,
        duration: 2000,
        style: {
          background: '#dbe7f0ff',
          color: '#000',
          border: '1px solid #719bccff'
        }
      });

    } else {
      await Saved_Comment({ variables: { commentId: data.id } });

      toast.success("Se añadió a tus Elementos guardados", {
        icon: <FiBookmark size={16} color="#3676c0ff" />,
        duration: 2000,
        style: {
          background: '#dbe7f0ff',
          color: '#000',
          border: '1px solid #719bccff'
        }
      });
    }
  };

  return { isSaved, toggleSaved };
};