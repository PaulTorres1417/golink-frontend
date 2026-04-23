import { useNotificationStore, useTheme } from "@/store";
import { gql } from "@apollo/client";
import { useMutation } from "@apollo/client/react";
import { useEffect, useRef } from "react";

const SHOW_AS_READ = gql`
  mutation show_As_Read($notificationId: ID!) {
    showAsRead(notificationId: $notificationId)
  }
`;
type Props = {
  setIsOpenNotification: (value: boolean) => void;
}
export const useModalNotification = ({ setIsOpenNotification }: Props) => {
    const ref = useRef<HTMLDivElement>(null);
      const { notifications, resetCount, pageInfo } = useNotificationStore();
      const [show_As_Read] = useMutation(SHOW_AS_READ);
      const { theme } = useTheme();
    
      useEffect(() => {
        if (notifications.length > 0) {
          resetCount();
        }
      }, [notifications]);
    
      useEffect(() => {
        const showAsRead = async () => {
          for (const element of notifications) {
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
        if (notifications.length > 0) showAsRead();
      }, [notifications])
    
    
      useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
          if (ref.current && !ref.current.contains(e.target as Node)) {
            setIsOpenNotification(false);
          }
        };
        document.addEventListener('click', handleClickOutside);
        return () => document.removeEventListener('click', handleClickOutside);
      }, [setIsOpenNotification]);

      return { ref, theme, notifications, pageInfo };
}