import styled from "styled-components";
import type { RepostSource } from "./types";
import { Avatar } from "@/components/ui";

type repostPreviewProps = {
  data: RepostSource;
  theme: string;
}
export const RepostPostPreview = ({ data, theme }: repostPreviewProps) => {
  return (
    <QuotedPost $isDark={theme}>
      <QuotedHeader>
        <QuotedAvatarWrapper>
          <Avatar avatarUrl={data.payload.user_id.avatar} size={25}/>
        </QuotedAvatarWrapper>
        <QuotedName $isDark={theme}>{data.payload.user_id.name}</QuotedName>
        <QuotedHandle $isDark={theme}>
          @{data.payload.user_id.email?.split('@')[0] ?? 'anonymous'}
        </QuotedHandle>
      </QuotedHeader>

      <QuotedContent $isDark={theme}>
        {data.payload.content}
      </QuotedContent>

      {
        data.payload.kind === 'Post' &&
        data.payload.media && (
        <QuotedMedia>
          {data.payload.media.media_type === 'video' ? (
            <video src={data.payload.media.url} muted />
          ) : (
            <img src={data.payload.media.url} alt="media" />
          )}
        </QuotedMedia>
      )}
    </QuotedPost>
  )
}


const QuotedPost = styled.div<{ $isDark: string }>`
  border: 1px solid ${({ $isDark }) => 
    $isDark === 'dark' 
      ? 'rgba(125, 123, 123, 0.6)' 
      : 'rgba(182, 181, 181, 0.67)'};
  border-radius: 12px;
  padding: 12px;
  display: flex;
  flex-direction: column;
  zindex: 1000;
  gap: 6px;
`;

const QuotedHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 6px;
`;

const QuotedAvatarWrapper = styled.div`
  margin-bottom: 4px;
`;

const QuotedName = styled.span<{ $isDark: string }>`
  font-size: 14px;
  font-weight: 700;
  color: ${({ $isDark }) => $isDark === 'dark' ? '#fff' : '#000'};
`;

const QuotedHandle = styled.span<{ $isDark: string }>`
  font-size: 14px;
  color: rgba(113, 118, 123, 1);
`;

const QuotedContent = styled.p<{ $isDark: string }>`
  font-size: 14px;
  color: ${({ $isDark }) => $isDark === 'dark' ? '#e7e9ea' : '#333'};
  margin: 0;
  line-height: 1.5;
`;

const QuotedMedia = styled.div`
  margin-top: 4px;
  border-radius: 10px;
  overflow: hidden;

  img, video {
    width: 100%;
    height: auto;
    object-fit: contain;
    display: block;
    border-radius: 10px;
  }
`;