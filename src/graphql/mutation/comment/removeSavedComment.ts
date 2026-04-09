import { gql } from "@apollo/client";

export const REMOVE_SAVED_COMMENT = gql`
    mutation Remove_Saved_Comment($commentId: ID!) {
        removeSavedComment(commentId: $commentId) {
            id
            isSaved
        }
    }
`;