import styled from 'styled-components';
import { useState } from 'react';
import { gql } from '@apollo/client';
import { useMutation } from '@apollo/client/react';
import { useTheme } from '@/store/theme';
import { FaUserCircle } from "react-icons/fa";
import type { ListUserProps, UserFollowResponse, UserUnFollowResponse } from './types';

const FOLLOW_USER = gql`
  mutation Follow_User($userId: ID!) {
    followUser(userId: $userId)
  }
`;
const UNFOLLOW_USER = gql`
  mutation UnFollow_User($userId: ID!) {
    unFollowUser(userId: $userId)
  }
`;

export const ListUserNotFollowing = ({ data }: ListUserProps) => {
  const [isHovering, setIsHovering] = useState<boolean>(false);
  const [isFollow, setIsFollow] = useState<boolean>(false);
  const [ignoreHover, setIgnoreHover] = useState<boolean>(false);
  const { theme } = useTheme();
  const [Follow_User] = useMutation<UserFollowResponse>(FOLLOW_USER);
  const [UnFollow_User] = useMutation<UserUnFollowResponse>(UNFOLLOW_USER);

  const handleClickFollow = async (id: string) => {
    if (!isFollow) {
      try {
        const res = await Follow_User({ variables: { userId: id } });
        if (res.data?.followUser) {
          setIsFollow(true);
        }
      } catch (error) {
        console.error('Error al seguir usuario:', error);
      }
    } else {
      try {
        await UnFollow_User({ variables: { userId: id } });
        setIsFollow(false);
        setIsHovering(false);
        setIgnoreHover(true);
      } catch (error) {
        console.error('Error al dejar de seguir:', error);
      }
    }
  };

  const handleMouseEnter = () => {
    if (!ignoreHover) {
      setIsHovering(true);
    }
  };

  const handleMouseLeave = () => {
    setIsHovering(false);
    setIgnoreHover(false);
  };

  const getButtonText = () => {
    if (!isFollow) return 'Follow';
    return (isHovering && !ignoreHover) ? 'Unfollow' : 'Following';
  };

  return (
    <List key={data.id}>
      <UserInfoWrapper>
        {data.avatar ? (
          <ImageContent src={data.avatar} alt={data.avatar} />
        ) : (
          <FaUserCircle size={40} />
        )}
        <Information $themeMode={theme}>
          <span>
            {data.name
              .split("@")[0]
              .slice(0, 13)
              .concat(data.name.split("@")[0].length > 13 ? "..." : "")
            }
          </span>
          <span>
            @{data.email.split("@")[0].length > 13
              ? data.email.split("@")[0].slice(0, 13) + "..."
              : data.email.split("@")[0]}
          </span>
        </Information>
      </UserInfoWrapper>
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
    </List>
  )
}

const List = styled.li`
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 50px;
  margin: 5px;
  width: 100%;
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
    if (!$isFollow) {
      return $themeColor === 'dark' ? '#fff' : '#000';
    }
    if ($isHovering) return 'rgba(244, 33, 46, 0.1)';
    return 'transparent';
  }};

  color: ${({ $isFollow, $isHovering, $themeColor }) => {
    if (!$isFollow) {
      return $themeColor === 'dark' ? '#000' : '#d1cfcfff';
    }
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
;
const Information = styled.div<{ $themeMode: string }>`
  display: flex;
  flex-direction: column;
  
  span {
    font-size: 15px;
    color: ${({ $themeMode }) =>
    $themeMode === 'dark'
      ? 'rgba(113, 118, 123, 1)'
      : 'rgba(83, 100, 113, 1)'};
    
    &:first-child {
      color: ${({ $themeMode }) => ($themeMode === 'dark' ? '#fff' : '#000')};
      font-weight: bold;
    }
  }
`;

const ImageContent = styled.img`
  width: 40px;
  height: 40px;
  border-radius: 50%;
  object-fit: cover;
`;

const UserInfoWrapper = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
`;