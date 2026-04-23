import styled from 'styled-components';
import { FaUserCircle } from "react-icons/fa";
import type { ListUserProps } from './types';
import { useListUserNotFollowing } from '@/hooks/user/useListUserNotFollowing';
import { getDisplayName } from '@/utils/user/user';

export const ListUserNotFollowing = ({ data }: ListUserProps) => {
  const { getButtonText, handleClickFollow, handleMouseEnter,
    handleMouseLeave, isFollow, isHovering, theme } = useListUserNotFollowing();

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
            {getDisplayName(data.name)}
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