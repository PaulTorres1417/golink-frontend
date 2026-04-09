import { gql } from "@apollo/client";

export const POST_REPOST_COUNT_SUBSCRIPTION = gql`
  subscription Post_Repost_Count {
    postRepost {
      id
      count_repost
    }
  }
`;