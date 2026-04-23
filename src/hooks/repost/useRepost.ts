import type { Post } from "@/components/features/post/types";
import type { CommentProps } from "@/pages/post/types";
import { useTheme } from "@/store";
import { useNavigate } from "react-router-dom";

type RepostProps = {
  post: Post | null;
  comment: CommentProps | null;
}
export const useRepost = ({ post, comment }: RepostProps) => {
  const navigate = useNavigate();
  const { theme } = useTheme();

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();

    if (post) {
      navigate(`post/${post.id}`, {
        state: {
          postData: {
            kind: 'Post' as const,
            ...post,
            clientId: post.id,
            original_post: null,
            original_comment: null,
            initialReaction: false,
            has_viewed: false,
            isSaved: false,
            isRepost: false,
            comments: 0,
            view_count: 0,
            count_repost: 0,
            countReaction: 0,
          }
        }
      })
    } else if (comment) {
      navigate(`post/${comment.post_id.id}/comment/${comment.id}`, {
        state: {
          commentData: { kind: 'Comment' as const, ...comment },
          postData: comment.post_id
        }
      })
    }
  }
  return { theme, handleClick };
}