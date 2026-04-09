import { gql } from "@apollo/client";

export const REACTION_COMMENT_SUBSCRIPTION = gql`
    subscription Reaction_Comment {
        reactionComment {
            id
            comment_id {
                id
            }
            user_id {
                id
            }
            action
        }
    }
`;