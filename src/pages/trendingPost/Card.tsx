import styled from 'styled-components';
import { useTheme } from '@/store/theme';
import type { TrendingCard } from './types';
import { useNavigate } from 'react-router-dom';

export const Card = ({ post }: TrendingCard) => {
  const { theme } = useTheme();
  const navigate = useNavigate();

  const truncate = (text: string, limit: number) => {
    const res = text.length > limit ? text.slice(0, limit) + "..." : text;
    return res;
  }

  const handleClick = () => {
    navigate(`post/${post.id}`, {
      state: {
        postData: {
          kind: 'Post' as const,
          ...post,
          clientId: post.id,
          media: post.media ?? null,
          original_post: null,
          original_comment: null,
          initialReaction: false,
          has_viewed: false,
          isSaved: false,
          isRepost: false,
          comments: 0,
          view_count: 0,
          count_repost: post.count_repost ?? 0,
        }
      }
    })
  }

  return (
    <CardContainer 
     onClick={handleClick}
     $theme={theme}
    >
      <ThreadLayout>
        <ContentRight>
          <Header>
            <UserInfo $theme={theme}>
              <Title>
                <h2>{post.user_id.name.split(" ")[0]}</h2>
                <span>@{post.user_id.email.split("@")[0]}</span>
              </Title>
              <Content>{truncate(post.content, 120)}</Content>
            </UserInfo>
          </Header>

          <ThreadLeft>
            <AvatarGroup $isAvatar={post.reaction_avatars.length > 0}>
              {post.reaction_avatars.map((img, i) => (
                <SmallAvatar key={i} src={img} style={{ 
                  marginLeft: i === 0 ? 0 : '-10px',
                  zIndex: post.reaction_avatars.length - i
                }} 
                />
              ))}
            </AvatarGroup>
            <Estadistica>
              <p>{post.countReaction - post.reaction_avatars.length > 0
                ? post.countReaction - post.reaction_avatars.length > 1
                  ? `+ ${post.countReaction - post.reaction_avatars.length} reactions`
                  : `+ ${post.countReaction - post.reaction_avatars.length} reaction`
                : ''}</p>
            </Estadistica>
          </ThreadLeft>

        </ContentRight>
      </ThreadLayout>
    </CardContainer>
  )
}


const CardContainer = styled.div<{ $theme: string }>`
  width: 100%;
  padding: 5px 15px 5px 15px;
  cursor: pointer;
  height: auto;
`;

const ThreadLayout = styled.div`
  display: flex;
  flex-direction: column;
  gap: 5px;
`;

const ThreadLeft = styled.div`
  display: flex;
  padding: 5px;
  align-items: center;
  flex-shrink: 0;
`;

const Estadistica = styled.div`
  padding-left: 12px;
  p {
    font-size: 12px;
  }
`;

const AvatarGroup = styled.div<{ $isAvatar: boolean }>`
  display: flex;
  margin-bottom: ${({ $isAvatar }) => $isAvatar ? '5px' : '0px'};
`;

const SmallAvatar = styled.img`
  width: 26px;
  height: 26px;
  border-radius: 50%;
  object-fit: cover;
`;

const ContentRight = styled.div`
  flex: 1;
  min-width: 0;
`;

const Header = styled.div`
  display: flex;
  padding: 5px;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 2px;
`;

const UserInfo = styled.div<{ $theme: string }>`
  display: flex;
  flex-direction: column;
  h2 {
    font-size: 14px;
    color: ${({ $theme }) => $theme === 'dark' ? '#fff' : '#000'};
  }
  span {
    font-size: 14px;
    color: ${({ $theme }) =>
    ($theme === 'dark'
      ? '#8698c4ff'
      : 'rgba(83, 100, 113, 1)')};
  }
`;

const Content = styled.p`
  font-size: 14px;
  margin-top: 4px;
`;

const Title = styled.div`
  display: flex;
  gap: 5px;
  align-items: center;
`;
