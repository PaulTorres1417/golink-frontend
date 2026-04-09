import { gql } from "@apollo/client";

export const VIEWED_POST_SUBSCRIPTION = gql`
    subscription PostViewed {
        postViewed {
            id
            view_count
            user_id {
                id
            }
        }
    }
`;