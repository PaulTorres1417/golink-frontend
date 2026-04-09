import { gql } from "@apollo/client";

export const REACTION_POST_SUBSCRIPTION = gql`
  subscription ReactionPost {
    reactionPost {
      id
      post_id {
        id
      }
      user_id {
        id
      }
      action
    }
  }
`;