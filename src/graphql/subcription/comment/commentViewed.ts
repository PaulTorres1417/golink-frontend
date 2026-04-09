import { gql } from "@apollo/client";

export const VIEW_COMMENT_SUBSCRIPTION = gql`
    subscription Comment_viewed {
        commentViewed {
            id
            view_count
            has_viewed
            user_id {
                id
            }
        }
    }
`;