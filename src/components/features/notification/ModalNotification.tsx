import styled from 'styled-components';
import { FaUserCircle } from 'react-icons/fa';
import { dayjs } from '@/utils';
import { HiMiniHeart } from "react-icons/hi2";
import { FaCommentDots } from "react-icons/fa6";
import { FaComments } from "react-icons/fa6";
import { BiRepost } from "react-icons/bi";
import { Spinner } from '@/components/ui';
import { useModalNotification } from '@/hooks/modal/useModalNotification';
import type { ModelProps } from './types';
import { getDisplayName } from '@/utils/user/user';

export const ModalNotification = ({ setIsOpenNotification, handleFetchMore, isPending }: ModelProps) => {
  const { notifications, pageInfo, ref, theme } = useModalNotification({ setIsOpenNotification });

  const handleCLick = (e: React.MouseEvent<HTMLDivElement>) => {
    e.stopPropagation();
  }

  return (
    <Container ref={ref} $themeColor={theme} onClick={handleCLick}>
      <Header>Notifications</Header>

      <NotificationList>
        {notifications.length > 0 ? (
          notifications
            .map((notification) => {
              return <NotificationItem key={notification.id}>
                {notification.actor_id.avatar ? (
                  <Avatar src={notification.actor_id.avatar} alt={notification.actor_id.name} />
                ) : (
                  <DefaultAvatar>
                    <FaUserCircle size={35} />
                  </DefaultAvatar>
                )}
                <NotificationContent>
                  <NotificationText>
                    <strong>
                      {getDisplayName(notification.actor_id.name)}
                    </strong>
                    {" "}{notification.type.split("_").join(" ").toLocaleLowerCase()}.
                  </NotificationText>
                  <NotificationTime>{dayjs(notification.created_at).fromNow(true)}</NotificationTime>
                </NotificationContent>
                {
                  notification.type === 'LIKED_YOUR_POST' || notification.type === 'LIKED_YOUR_COMMENT'
                    ? <HiMiniHeart size={25} style={{ color: '#c3686fff' }} />
                    : notification.type === 'COMMENTED_ON_YOUR_POST'
                      ? <FaCommentDots size={25} style={{ color: '#7ca2c6ff' }} />
                      : notification.type === 'REPLIED_TO_YOUR_COMMENT'
                        ? <FaComments size={25} style={{ color: '#79a5ceff' }} />
                        : notification.type === 'REPOSTED_YOUR_POST' || notification.type === 'REPOSTED_YOUR_COMMENT'
                          ? <BiRepost size={25} style={{ color: '#74b593ff' }} />
                          : null
                }
              </NotificationItem>
            })

        ) : (
          <EmptyState>There are no notifications...</EmptyState>
        )}
      </NotificationList>
      {/* buttom show more */}
      {pageInfo?.hasNextPage && (
        <ViewMoreButton onClick={handleFetchMore}>
          {isPending ? <Spinner /> : "see more..."}
        </ViewMoreButton>
      )}
    </Container>
  );
};


const Container = styled.div<{ $themeColor: string }>`
  position: absolute;
  width: 320px;
  max-height: 500px;
  right: 0;
  top: 105%;
  z-index: 999;
  border-radius: 12px;
  background: ${({ $themeColor }) => ($themeColor === 'dark' ? '#2d394cff' : '#ffffff')};
  color: ${({ $themeColor }) => ($themeColor === 'dark' ? '#fff' : '#000')};
  box-shadow:
  0 2px 8px rgba(0, 0, 0, 0.15),
  0 8px 24px rgba(0, 0, 0, 0.18),
  0 0 0 1px rgba(0, 0, 0, 0.08);
  display: flex;
  flex-direction: column;
  overflow: hidden;
`;

const Header = styled.div`
  padding: 16px 20px;
  font-size: 18px;
  font-weight: 600;
  border-bottom: 1px solid rgba(0,0,0,0.1);
`;

const NotificationList = styled.ul`
  flex-grow: 1;
  overflow-y: auto;
  list-style: none;
  margin: 0;
  padding: 0;
`;

const NotificationItem = styled.li<{ unread?: boolean }>`
  display: flex;
  align-items: center;
  padding: 12px 16px;
  background: ${({ unread }) => (unread ? 'rgba(0, 123, 255, 0.05)' : 'transparent')};
  border-bottom: 1px solid rgba(0,0,0,0.05);
  cursor: pointer;
  transition: background 0.2s;

  &:hover { background: rgba(0, 0, 0, 0.14) }
`;

const Avatar = styled.img`
  width: 40px;
  height: 40px;
  border-radius: 50%;
  object-fit: cover;
  margin-right: 12px;
`;

const DefaultAvatar = styled.div`
  width: 40px;
  height: 40px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 12px;
`;

const NotificationContent = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
`;

const NotificationText = styled.p`
  margin: 0;
  font-size: 14px;
`;

const NotificationTime = styled.span`
  font-size: 12px;
  color: #888;
  margin-top: 4px;
`;

const EmptyState = styled.div`
  padding: 30px;
  text-align: center;
  font-size: 14px;
  color: #999;
`;

const ViewMoreButton = styled.button`
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 10px;
  font-size: 15px;
  border: none;
  cursor: pointer;
  color: #2ba3e9ff;
  background: rgba(0, 123, 255, 0.05);

  &:hover {
    background: rgba(0, 0, 0, 0.14);
    font-weight: bold;
    color: #2ba3e9ff;
  }
`;