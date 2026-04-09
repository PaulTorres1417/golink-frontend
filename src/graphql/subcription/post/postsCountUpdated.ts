import { gql } from "@apollo/client";

export const POST_COMMENT_COUNT_SUBSCRIPTION = gql`
    subscription PostCommentCount {
        postCommentsCount {
            id
            comments
        }
    }
`;