import { useState } from 'react';
import { useMutation } from '@apollo/client/react';
import { useTheme } from '@/store/theme';
import type { UserFollowResponse, UserUnFollowResponse } from '@features/user/types';
import { FOLLOW_USER } from '@/graphql/mutation/user/followUser';
import { UNFOLLOW_USER } from '@/graphql/mutation/user/unFollowUser';

export const useListUserNotFollowing = () => {
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

  return { theme, isHovering, isFollow, handleClickFollow, 
    handleMouseEnter, handleMouseLeave, getButtonText };
}