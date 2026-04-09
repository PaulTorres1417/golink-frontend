import styled from "styled-components";
import { useEffect, useState, useTransition } from "react";
import { useQuery } from "@apollo/client/react";
import { Notifications } from './components/Notifications'
import { useNotificationStore, useTheme, useFollowerStore, useAuthStore } from "@/store";
import { GET_NOTIFICATIONS, GET_FOLLOWER } from "@/graphql/query";
import { ModalFollower } from "../features/notification/ModalFollower";
import { ModalNotification } from "../features/notification/ModalNotification";
import type { GetFollowerProps, GetNotifiProps } from "./components/types";
import { PiHeart } from "react-icons/pi";
import { GrNotification } from "react-icons/gr";

export const NavBarRight = () => {
  const [isOpenNotification, setIsOpenNotification] = useState(false);
  const [isOpenFollower, setIsOpenFollower] = useState(false);
  const [isPending, startTransition] = useTransition();
  const [isPendingFollower, startTransitionFollower] = useTransition();
  const user = useAuthStore((state) => state.user);
  const { theme } = useTheme();
  const addNotificationFetchMore = useNotificationStore((state) => state.addNotificationFetchMore);
  const { addAllNotifications, notificationsCount, setPageInfo, pageInfo } = useNotificationStore();
  const addFollowerFetchMore = useFollowerStore((state) => state.addFollowerFetchMore);
  const { addAllFollowers, followerCount, setPageInfoFollower, pageInfoFollower } = useFollowerStore();

  const { data, fetchMore } = useQuery<GetNotifiProps>(GET_NOTIFICATIONS, {
    variables: { first: 2 }
  })
  const { data: dataFollower, fetchMore: fetchMoreFollower } = useQuery<GetFollowerProps>(GET_FOLLOWER, {
    variables: { first: 2 }
  });

  useEffect(() => {
    const edges = data?.getNotifications?.edges;
    const pageInfo = data?.getNotifications?.pageInfo;
    if (edges && edges.length > 0) {
      addAllNotifications(edges.map(el => el.node));
      if (pageInfo) setPageInfo(pageInfo);
    }
  }, [data?.getNotifications?.pageInfo.endCursor])

  const handleFetchMore = () => {
    if (!pageInfo?.hasNextPage) return;
    startTransition(async () => {
      const { data: dataFetchMore } = await fetchMore({
        variables: { first: 2, after: pageInfo.endCursor }
      })
      const edgesMore = dataFetchMore?.getNotifications?.edges ?? [];
      const pageInfoMore = dataFetchMore?.getNotifications?.pageInfo;
      if (edgesMore) {
        addNotificationFetchMore(edgesMore.map(n => n.node));
        if (pageInfoMore) setPageInfo(pageInfoMore)
      }
    })
  }

  useEffect(() => {
    const edges = dataFollower?.getFollowers?.edges;
    const pageInfo = dataFollower?.getFollowers?.pageInfo;
    if (edges && edges.length > 0) {
      addAllFollowers(edges.map(el => el.node));
      if (pageInfo) setPageInfoFollower(pageInfo);
    }
  }, [dataFollower?.getFollowers?.pageInfo.endCursor])

  const FetchMoreFollower = () => {
    if (!pageInfoFollower?.hasNextPage) return;
    startTransitionFollower(async () => {
      const { data: dataFetchFollower } = await fetchMoreFollower({
        variables: { first: 2, after: pageInfoFollower.endCursor }
      })
      const edgesMore = dataFetchFollower?.getFollowers?.edges ?? [];
      const pageInfoMore = dataFetchFollower?.getFollowers?.pageInfo;
      if (edgesMore) {
        addFollowerFetchMore(edgesMore.map(el => el.node));
        if (pageInfoMore) setPageInfoFollower(pageInfoMore);
      }
    })
  }

  return (
    <>
      <NavBarContainer $themeMode={theme}>
        <NavbarItems>

          {/* Seguidores */}
          <IconWrapper onClick={(e) => {
            e.stopPropagation();
            setIsOpenFollower((prev) => !prev);
          }}>
            <BadgeWrapper>
              <PiHeart
                size={26}
                color={isOpenFollower
                  ? '#1DA1F2'
                  : theme === 'dark' ? '#eeeeee' : '#302f2f'
                }
              />
              {followerCount > 0 && <BadgeCount>{followerCount}</BadgeCount>}
            </BadgeWrapper>
            {isOpenFollower &&
              <ModalFollower
                setIsOpenFollower={setIsOpenFollower}
                isPendingFollower={isPendingFollower}
                FetchMoreFollower={FetchMoreFollower}
              />}
          </IconWrapper>

          {/* Notificaciones */}
          <IconWrapper onClick={(e) => {
            e.stopPropagation();
            setIsOpenNotification((prev) => !prev);
          }}>
            <BadgeWrapper>
              <GrNotification
                size={22}
                color={isOpenNotification
                  ? '#1DA1F2'
                  : theme === 'dark' ? '#eeeeee' : '#302f2f'
                }
              />
              {notificationsCount > 0 && <BadgeCount>{notificationsCount}</BadgeCount>}
            </BadgeWrapper>
            {isOpenNotification &&
              <ModalNotification
                setIsOpenNotification={setIsOpenNotification}
                handleFetchMore={handleFetchMore}
                isPending={isPending}
              />}
          </IconWrapper>

        </NavbarItems>
      </NavBarContainer>
      {user && <Notifications />}
    </>
  );
};

const NavBarContainer = styled.nav<{ $themeMode: string }>`
  position: sticky;
  top: 0;
  width: 100%;
  height: 56px;
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 800;
  backdrop-filter: blur(10px);
`;

const NavbarItems = styled.div`
  display: flex;
  gap: 12px;
  justify-content: flex-end;
  padding-right: 20px;
  align-items: center;
  width: 350px;
  height: 55px;

  svg {
    font-size: 32px;
    cursor: pointer;
  }
`;

const IconWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  width: 40px;
  height: 40px;
  border-radius: 50%;
`;

/* 👇 Reemplazo del Badge de MUI */
const BadgeWrapper = styled.div`
  position: relative;
  display: inline-flex;
`;

const BadgeCount = styled.span`
  position: absolute;
  top: -8px;
  left: 14px;
  background: #3d85f2ff;
  color: white;
  font-size: 0.8rem;
  font-weight: 400;
  min-width: 16px;
  height: 16px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 8px 6px;
  z-index: 1;
`;