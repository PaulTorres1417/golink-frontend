import { gql } from "@apollo/client";

export const COMMENTS_COUNT_SUBSCRIPTION = gql`
    subscription Comments_count {
        commentsCount {
            id
            user_id {
                id
                name
                avatar
            }
            comments
        }
    }
`;