import type { CommentType, PostType } from "../types";

export type Postprops = {
  post: {
    id: string;
    content: string;
    user_id: {
      id: string;
      name: string;
      email: string;
      avatar?: string | null;
    };
    created_at: string;
    media: {
      media_type: string;
      url: string;
    }
  }
}

export type RepostSource = {
  type: string;
  payload: PostType | CommentType;
}