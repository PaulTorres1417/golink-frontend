import { gql } from "@apollo/client";

export const REMOVE_SAVED_POST = gql`
    mutation Remove_Saved_Post($postId: ID!) {
        removeSavedPost(postId: $postId) {
            id
            isSaved
        }
    }
`;