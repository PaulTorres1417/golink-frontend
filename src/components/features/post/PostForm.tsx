import styled from "styled-components";
import { FaUserCircle } from "react-icons/fa";
import { useAuthStore, useTheme } from '@/store';
import { useCreatePost } from "@/hooks/post";
import { Editor } from "./modals/Editor";
import { Actions } from "./modals/Actions";
import type { RepostSource } from "./modals/types";

type PostFormProps = {
  data?: RepostSource;
  hideAvatar: boolean;
  onClose?: () => void;
  border?: boolean;
}
export const PostForm = ({ hideAvatar, data, onClose, border }: PostFormProps) => {
  const { text, setText, file, setFile, previewUrl,
    fileInputRef, handleRemoveFile, handleCreatePost } = useCreatePost(data, onClose);
  const user = useAuthStore((state) => state.user);
  const { theme } = useTheme();
  const size = "50px";
  const isRepost = data?.type ? true : false;

  if (!user) return null;
  return (
    <Container $isRepost={isRepost} $theme={theme} $border={border}>
      {!hideAvatar 
        && <AvatarForm url={user.avatar || null} />
      }
      <TextContainer>
        <Editor text={text} setText={setText} name={user.name} size={size} data={data?.type} />
        {
          previewUrl && (
            <PreviewContainer>
              <CloseButton onClick={handleRemoveFile}>x</CloseButton>
              {file?.type.startsWith("image/") ? (
                <PreviewImage src={previewUrl} alt="preview" />
              ) : file?.type.startsWith("video/") ? (
                <PreviewVideo controls>
                  <source src={previewUrl} />
                </PreviewVideo>
              ) : null}
            </PreviewContainer>
          )
        }
        {/* actions icons */}
        <Actions
          text={text}
          setFile={setFile}
          fileInputRef={fileInputRef}
          handleCreatePost={handleCreatePost}
          data={data?.type}
        />
      </TextContainer>
    </Container>
  );
};

const AvatarForm = ({ url }: { url: string | null }) => {
  return (
    <AvatarContainer>
      {url ? (
        <img src={url} alt={url} />
      ) : (
        <FaUserCircle size={40} />
      )}
    </AvatarContainer>
  )
}
const Container = styled.div<{ $isRepost: boolean, $theme: string, $border?: boolean }>`
  width: 100%;
  display: flex;
  gap: 14px;
  padding: ${({ $isRepost }) => $isRepost ? "14px 3px" : "14px 12px"};
  border-bottom: ${({ $border, $theme }) => 
    $border 
      ? 'none' 
      : $theme === 'dark'
        ? '1px solid rgba(132, 130, 130, 0.37)'
        : '1px solid rgba(197, 197, 197, 0.41)'};
`;
const TextContainer = styled.div`
  width: 100%;
  max-width: 518px;
  border-radius: 15px; 
`;
const PreviewContainer = styled.div`
  position: relative;
  margin: 10px 0;
  max-width: 200px;
  border-radius: 10px;
  overflow: hidden;
`;
const PreviewImage = styled.img`
  width: 100%;
  max-height: 300px;
  object-fit: cover;
`;

const PreviewVideo = styled.video`
  width: 100%;
  max-height: 400px;
  border-radius: 10px;
  background: #000;
`;
const CloseButton = styled.button`
  position: absolute;
  top: 5px;
  left: 5px;
  border: none;
  border-radius: 50%;
  font-size: 18px;
  width: 28px;
  font-weight: bold;
  height: 28px;
  cursor: pointer;
  z-index: 10;

  &:hover {
    background: rgba(182, 197, 201, 0.8);
  }
`;
/* avatar */
const AvatarContainer = styled.div`
  flex-shrink: 0;
  display: flex;
  padding-top: 10px;
  justify-content: center;
  width: 40px;
  height: 100%;
  img {
    width: 40px;
    height: 40px;
    border-radius: 50%;
    object-fit: cover;
  }
`;