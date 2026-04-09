import styled from "styled-components";
import { Avatar } from "@/components/ui";
import { useTheme } from "@/store/theme";
import { dayjs } from '@/utils';
import type { CommentType, PostType } from "../types";

type Postprops = {
  post: PostType | CommentType;
}

export const Thread = ({ post }: Postprops) => {
  const { theme } = useTheme();

  return (
    <>
      <FixedHeader>
        <Header>
          <NavbarHeader>
            <Avatar avatarUrl={post.user_id.avatar} />
            <Information $theme={theme}>
              <h3>{post.user_id?.name
                .split("@")[0]
                .slice(0, 30)
                .concat(post.user_id.name.split("@")[0].length > 30 ? "..." : "")
              }</h3>
              <p>@{post.user_id.email ? post.user_id.email.split("@")[0] : "anonimus"}</p>
            </Information>
          </NavbarHeader>
        </Header>
      </FixedHeader>

      <ScrollableContent>
        <PostContent>
          <p>{post?.content}</p>
        </PostContent>

        {post.kind === 'Post' && post.media && (
          <MediaContainer>
            {post.media.media_type === "image" ? (
              <img src={post.media.url} alt="post" />
            ) : (
              <video
                autoPlay={true}
                playsInline
                preload="metadata"
                controls
                loop
                muted
              >
                <source src={post.media.url} type="video/mp4" />
              </video>
            )}
          </MediaContainer>
        )}

        <PostInformation $themeMode={theme}>
          <p>{dayjs(post.created_at).format('h:mm A · MMM D, YYYY')}{' · '}
            {post.view_count > 1 ? post.view_count + ' views' : post.view_count + ' view'}</p>
        </PostInformation>
      </ScrollableContent>
    </>
  )
}

const FixedHeader = styled.div`
  top: 0;
  z-index: 10;
`;

const Header = styled.div`
  width: 100%;
  display: flex;
  padding: 0px 12px 5px 12px;
  justify-content: space-between;
  align-items: center;
`;

const NavbarHeader = styled.div`
  display: flex;
  gap: 8px;
  align-items: center;
`;

const Information = styled.div<{ $theme: string }>`
  display: flex;
  flex-direction: column;
  gap: 1.5px;
  h3 {
    font-size: 15px;
    font-weight: 600;
  }
  p {
    font-size: 15px;
    font-weight: 300;
    color: ${({ $theme }) =>
    $theme === 'dark'
      ? 'rgba(113, 118, 123, 1)'
      : 'rgba(83, 100, 113, 1)'};
  }
`;

const ScrollableContent = styled.div`
`;

const PostContent = styled.div`
  width: 100%;
  padding: 12px 12px;
  p {
    font-size: 16px;
    line-height: 1.5;
  }
`;

const MediaContainer = styled.div`
  width: 100%;
  display: flex;
  justify-content: center;
  padding: 0 12px;
  box-sizing: border-box;

  img,
  video {
    width: 100%;
    max-height: auto;
    object-fit: contain;
    border-radius: 12px;
    display: block;
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.08);
  }
`;

const PostInformation = styled.div<{ $themeMode: string }>`
  display: flex;
  width: 100%;
  height: 50px;
  align-items: center;
  padding: 5px 12px;
  justify-content: flex-start;
  width: 100%;
  font-weight: 400;
  font-size: 14px;
  border-bottom: 1px solid ${({ $themeMode }) =>
    $themeMode === 'dark'
      ? 'rgba(132, 130, 130, 0.37)'
      : 'rgba(197, 197, 197, 0.41)'};

  p{
    font-size: 15px;
    color: ${({ $themeMode }) => $themeMode === 'dark' ? 'rgba(136, 140, 145, 1)' : 'rgba(53, 71, 99, 0.9)'}
  }
`;
