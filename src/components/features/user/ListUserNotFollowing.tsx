import styled from 'styled-components';
import type { ListUserProps } from './types';
import { useListUserNotFollowing } from '@/hooks/user/useListUserNotFollowing';
import { getDisplayName } from '@/utils/user/user';
import { Avatar } from '@/components/ui';
import { useTheme } from '@/store';

export const ListUserNotFollowing = ({ data, info, state }: ListUserProps) => {
  const { theme } = useTheme();
  const { getButtonText, handleClickFollow, handleMouseEnter,
    handleMouseLeave, isFollow, isHovering } = useListUserNotFollowing(state);

  return (
    <List>
      <Avatar avatarUrl={data.avatar} />
      <UserInfoWrapper>
        <Content>
          <Information $themeMode={theme}>
            <span>{getDisplayName(data.name)}</span>
            <span>
              @{data.email.split("@")[0].length > 13
                ? data.email.split("@")[0].slice(0, 13) + "..."
                : data.email.split("@")[0]}
            </span>
          </Information>
          <ButtonWrapper>
            <Button
              $isFollow={isFollow}
              $isHovering={isHovering}
              $themeColor={theme}
              onClick={() => handleClickFollow(data.id)}
              onMouseEnter={handleMouseEnter}
              onMouseLeave={handleMouseLeave}
            >
              {getButtonText()}
            </Button>
          </ButtonWrapper>
        </Content>
        {info && data.bio && (
          <Description>{data.bio}</Description>
        )}
      </UserInfoWrapper>
    </List>
  );
};

const List = styled.div`
  display: flex;
  gap: 10px;
  margin: 5px;
  width: 100%;
  height: auto;
`;

const Content = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
`;

const Information = styled.div<{ $themeMode: string }>`
  display: flex;
  flex-direction: column;

  span {
    font-size: 14px;
    color: ${({ $themeMode }) =>
      $themeMode === 'dark'
        ? '#8698c4ff'
        : 'rgba(83, 100, 113, 1)'};

    &:first-child {
      color: ${({ $themeMode }) => ($themeMode === 'dark' ? '#fff' : '#000')};
      font-weight: bold;
      font-size: 15px;
    }
  }
`;

const UserInfoWrapper = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  height: auto;
  gap: 6px;
`;

const ButtonWrapper = styled.div`
  flex-shrink: 0;
`;

const Button = styled.button<{
  $themeColor: string;
  $isFollow: boolean;
  $isHovering: boolean;
}>`
  height: 32px;
  width: 80px;
  border-radius: 17px;
  font-weight: bold;
  cursor: pointer;
  font-size: 14px;

  background: ${({ $isFollow, $isHovering, $themeColor }) => {
    if (!$isFollow) return $themeColor === 'dark' ? '#fff' : '#000';
    if ($isHovering) return 'rgba(244, 33, 46, 0.1)';
    return 'transparent';
  }};

  color: ${({ $isFollow, $isHovering, $themeColor }) => {
    if (!$isFollow) return $themeColor === 'dark' ? '#000' : '#d1cfcfff';
    if ($isHovering) return '#f4212e';
    return $themeColor === 'dark' ? '#d1cfcfff' : '#000';
  }};

  border: ${({ $isFollow, $isHovering }) => {
    if (!$isFollow) return 'none';
    if ($isHovering) return '1px solid #f4212e';
    return '1px solid #536471';
  }};

  &:hover {
    opacity: ${({ $isFollow }) => ($isFollow ? '1' : '0.8')};
  }
`;

const Description = styled.div`
  font-size: 14px;
  color: #536471;
`;