import { useEffect, useRef } from 'react';
import styled from 'styled-components';
import { FaPowerOff } from "react-icons/fa6";
import { useAuthStore, usePostStore, useTheme, useSavedPostStore } from '@/store';
import { useNavigate } from 'react-router-dom';
import { useApolloClient } from '@apollo/client/react';
import { TokenStore } from '@/store/auth/tokenStore';

interface ModalProps {
  setIsModalOpen: (value: boolean) => void;
  isCollapsed: boolean;
}

export const ModalExit = ({ setIsModalOpen, isCollapsed }: ModalProps) => {
  const logout = useAuthStore((state) => state.logout);
  const ref = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  const client = useApolloClient();
  const user = useAuthStore((state) => state.user);
  const resetPost = usePostStore((state) => state.resentPosts);
  const { theme } = useTheme();
  const clearSavedPost = useSavedPostStore((state) => state.clearSavedPost);

  useEffect(() => {
    const handleClickOustside = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setIsModalOpen(false);
      }
    }
    document.addEventListener("click", handleClickOustside);
    return () => document.removeEventListener("click", handleClickOustside);
  }, [setIsModalOpen])

  const handleClickExit = async () => {
    await fetch('http://localhost:4000/auth/logout', {
      method: 'POST',
      credentials: 'include'
    })
    clearSavedPost()
    logout();
    resetPost();
    localStorage.removeItem("auth-storage");
    client.clearStore();

    TokenStore.clear();
    navigate('/login');
  }
  return (
    <Container ref={ref} $themeColor={theme} $isCollapsed={isCollapsed}>
      <Overlay>
        <DivText 
         onClick={handleClickExit} 
         $theme={theme}
         $isCollapsed={isCollapsed}>
          <FaPowerOff />
          {
            isCollapsed === false &&
            <H2>Log out {user ? user.name.split(' ')[0]: ''}</H2>
          }
        </DivText>
      </Overlay>
    </Container>
  );
};

const Container = styled.div<{ $themeColor: string, $isCollapsed: boolean }>`
  position: absolute;
  z-index: 900;
  border: 1px solid rgba(159, 158, 158, 0.55);
  background: ${({ $themeColor }) => ($themeColor === 'dark' ? '#000' : '#fff')};

  ${({ $isCollapsed, $themeColor }) => $isCollapsed ? `
    width: 50px;
    height: 50px;
    padding: 10px;
    border: ${$themeColor === 'dark' 
        ? '1px solid #f84838c3' 
        : '2px solid #f84838ae'};
    border-radius: 50%;
    bottom: 131%;
    left: 50%;
    transform: translateX(-50%);

    &:hover {
      border: 2px solid #ff1500ff;
      svg { color: #ff1500ff }
    }
  ` : `
    width: 230px;
    height: 60px;
    border-radius: 7px;
    right: 0;
    left: 0;
    bottom: 100%;

    &:hover {
      svg { color: #ff1500ff }
    }
  `}
`;

const DivText = styled.div<{ $isCollapsed: boolean, $theme: string }>`
  display: flex;
  gap: 10px;
  justify-content: center;
  align-items: center;
  width: 100%; 
  height: 100%;
  padding: 1px;  

  svg {
    color: ${({ $theme }) => 
      $theme === 'dark' 
        ? '#f84838c3' 
        : '#f84838c3'};
  }
`;

const H2 = styled.h2`
  font-size: 15px;
  font-weight: 400;
`;

const Overlay = styled.div`
  display: flex;
  width: 100%;
  height: 100%;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`;