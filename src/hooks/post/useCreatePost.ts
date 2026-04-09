import { useRef, useState, useEffect } from "react";
import { GET_SIGNATURE, CREATE_POST } from "@/graphql/mutation";
import type { CommentType, CreatePostData, GenerateUploadSignatureResponse, 
  Post, PostQueryProps, PostsByUserVars, 
  PostType} from "@/components/features/post/types";
import { useApolloClient, useMutation } from "@apollo/client/react";
import { useAuthStore } from "@/store/auth";
import { usePostStore } from "@/store/post";
import type { CommentProps } from "@/pages/post/types";

type RepostSource = {
  type: string;
  payload: PostType | CommentType;
}

export const useCreatePost = (data?: RepostSource, onClose?: () => void ) => {
  const [text, setText] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [getSignature] = useMutation<GenerateUploadSignatureResponse>(GET_SIGNATURE);
  const user = useAuthStore((state) => state.user);
  const { addPost, updatePost, updatePostFields } = usePostStore();
  const [createPost] = useMutation<CreatePostData, PostsByUserVars>(CREATE_POST);
  const client = useApolloClient();

  useEffect(() => {
    if (!file) { setPreviewUrl(null); return; }
    const objectUrl = URL.createObjectURL(file);
    setPreviewUrl(objectUrl);
    return () => URL.revokeObjectURL(objectUrl);
  }, [file]);

  const handleRemoveFile = () => {
    setFile(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const originalPost: Post | null = data?.type === "post" ? {
    id: data.payload.id,
    content: data.payload.content,
    user_id: {
      id: data.payload.user_id.id,
      name: data.payload.user_id.name,
      avatar: data.payload.user_id.avatar ?? null,
      email: data.payload.user_id.email,
    },
    media: (data.payload as PostType).media ?? null,
  } : null;

  const originalComment: CommentProps | null = data?.type === "comment" ? {
    id: data.payload.id,
    content: data.payload.content,
    parent_id: (data.payload as CommentProps).parent_id,
    post_id: (data.payload as CommentType).post_id,
    user_id: {
      id: data.payload.user_id.id,
      name: data.payload.user_id.name,
      avatar: data.payload.user_id.avatar ?? null,
      email: data.payload.user_id.email,
    },
    created_at: data.payload.created_at,
    comments: data.payload.comments,
    reactions: (data.payload as CommentProps).reactions,
    initialReaction: data.payload.initialReaction,
    view_count: data.payload.view_count,
    has_viewed: data.payload.has_viewed,
    isSaved: data.payload.isSaved,
    count_repost: data.payload.count_repost,
    isRepost: data.payload.isRepost
  } : null;

  const handleCreatePost = async () => {
    if (!user) return;
    const tempId = crypto.randomUUID();
    const originalText = text;
    const originalFile = file;

    const newPost: PostQueryProps = {
      id: tempId,
      clientId: '',
      content: text,
      user_id: { id: user.id, name: user.name, avatar: user.avatar || null, email: user.email },
      media: file ? {
        id: "temp-media" + tempId,
        url: URL.createObjectURL(file),
        media_type: file.type.startsWith("image/") ? "image" : "video",
      } : null,
      created_at: new Date().toISOString(),
      original_comment: originalComment,
      original_post: originalPost,
      countReaction: 0,
      comments: 0,
      initialReaction: false,
      view_count: 0,
      has_viewed: false,
      isSaved: false,
      count_repost: 0,
      isRepost: false,
    };

    addPost(newPost);
    setText("");
    setFile(null);
    onClose?.();

    let media = null;
    if (originalFile) {
      const { data: signatureData } = await getSignature({ variables: { folder: 'posts' } });
      if (!signatureData) return;
      const { timestamp, signature, apikey, cloudName } = signatureData.generateUploadSignature;
      const formData = new FormData();
      formData.append("file", originalFile);
      formData.append("api_key", apikey);
      formData.append("timestamp", timestamp.toString());
      formData.append("signature", signature);
      formData.append("folder", "posts");

      const res = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/auto/upload`, {
        method: "POST",
        body: formData,
      });
      const uploaded = await res.json();
      media = { url: uploaded.secure_url, media_type: uploaded.resource_type };
    }
   
    try {
      const { data: backendData } = await createPost({
        variables: {
          content: originalText,
          media,
          originalPostId: (data?.type === 'post' 
            ? (data.payload as PostType).clientId || data.payload.id
            : null) ?? null,
          originalCommentId: (data?.type === 'comment' 
            ? data.payload.id : null) ?? null
        }
      });

      if (backendData?.createPost) {
        updatePost(tempId, {
          ...backendData.createPost,
          clientId: backendData.createPost.id,
          countReaction: 0,
          comments: 0,
          initialReaction: false,
          view_count: 0,
          has_viewed: false,
          isSaved: false,
          created_at: new Date(Number(backendData.createPost.created_at)).toISOString(),
          count_repost: backendData.createPost.count_repost ?? 0,
          isRepost: backendData.createPost.isRepost ?? false,
          original_post: backendData.createPost.original_post ?? null,
          original_comment: backendData.createPost.original_comment ?? null,
        });

        if(data?.type === "post") {
          updatePostFields(data.payload.id, {
            count_repost: (data.payload as PostType).count_repost + 1,
            isRepost: true
          });
        } else if (data?.type === "comment") {
          client.cache.modify({
            id: client.cache.identify({ __typename: "Comment", id: data.payload.id }),
            fields: {
              isRepost: () => true
            }
          })
        }
      }
    } catch (error) {
      console.error('Error creando post', error);
    }
  };

  return {
    text,
    setText,
    file,
    setFile,
    previewUrl,
    fileInputRef,
    handleRemoveFile,
    handleCreatePost
  };
};