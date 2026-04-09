import { gql } from "@apollo/client";

export const REPOST_COMMENT_COUNT = gql`
  subscription {
    commentRepost {
      id
      count_repost
    }
  }
`;