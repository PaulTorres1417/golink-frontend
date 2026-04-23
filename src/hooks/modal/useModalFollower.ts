import { useEffect, useRef } from 'react';
import { gql } from '@apollo/client';
import { useMutation } from '@apollo/client/react';
import { useTheme, useFollowerStore } from '@/store';

const SHOW_AS_READ = gql`
  mutation show_As_Read($notificationId: ID!) {
    showAsRead(notificationId: $notificationId)
  }
`;
type Props = {
  setIsOpenFollower: (value: boolean) => void;
}

export const useModalFollower = ({ setIsOpenFollower }: Props) => {
  const ref = useRef<HTMLDivElement>(null);
  const { followers, resetCount, pageInfoFollower } = useFollowerStore();
  const [show_As_Read] = useMutation(SHOW_AS_READ);
  const { theme } = useTheme();

  useEffect(() => {
    if (followers.length > 0) {
      resetCount();
    }
  }, [followers]);

  useEffect(() => {
    const showAsRead = async () => {
      for (const element of followers) {
        if (!element.read) {
          try {
            await show_As_Read({ variables: { notificationId: element.id } });
          } catch (error) {
            console.error('Error al marcar como leidas', error);
            throw new Error('Error al read notifications views');
          }
        }
      }
    }
    if (followers.length > 0) showAsRead();
  }, [followers])


  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setIsOpenFollower(false);
      }
    };
    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, [setIsOpenFollower]);

  return { ref, theme, followers, pageInfoFollower };
}