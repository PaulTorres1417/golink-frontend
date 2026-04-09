import styled, { keyframes } from "styled-components";
import { RepostPostPreview } from "./RepostPostPreview";
import { createPortal } from "react-dom";
import { PostForm } from "../PostForm";
import { useTheme, useAuthStore } from '@/store';
import { FaUserCircle } from "react-icons/fa";
import { IoClose } from "react-icons/io5";
import type { RepostSource } from "./types";

type RepostModalProps = {
  onClose: () => void;
  source: RepostSource;
}

export const RepostModalPost = ({ onClose, source }: RepostModalProps) => {
  const user = useAuthStore((state) => state.user);
  const { theme } = useTheme();

  const handleBackdrop = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (e.target === e.currentTarget) onClose();
  };

  return createPortal(
    <Backdrop onClick={handleBackdrop}>
      <Modal $isDark={theme} onClick={(e) => e.stopPropagation()}>
        <ModalHeader $isDark={theme}>
          <CloseButton $isDark={theme}
            onClick={(e) => {
              e.stopPropagation();
              onClose();
            }}>
            <IoClose size={20} />
          </CloseButton>
        </ModalHeader>

        <ModalBody>
          <ThreadContainer>
            <AvatarColumn>
              <AvatarWrapper>
                {user?.avatar
                  ? <img src={user.avatar} />
                  : <FaUserCircle size={40} />}
              </AvatarWrapper>
              <Line $isDark={theme} />
            </AvatarColumn>

            <ContentColumn>
              <PostForm 
               hideAvatar={true} 
               border={true}
               data={source} 
               onClose={onClose} 
              />
            </ContentColumn>
          </ThreadContainer>
            <RepostPostPreview data={source} theme={theme} />
        </ModalBody>
      </Modal>
    </Backdrop>,
    document.body
  );
};

const fadeIn = keyframes`
  from { opacity: 0; }
  to { opacity: 1; }
`;

const slideUp = keyframes`
  from { transform: translateY(16px) scale(0.98); opacity: 0; }
  to { transform: translateY(0) scale(1); opacity: 1; }
`;

const Backdrop = styled.div`
  position: fixed;
  inset: 0;
  background: rgba(59, 83, 108, 0.41);
  display: flex;
  align-items: flex-start;
  padding-top: 90px;
  justify-content: center;
  z-index: 999;
  animation: ${fadeIn} 0.15s ease;
`;

const Modal = styled.div<{ $isDark: string }>`
  background: ${({ $isDark }) => $isDark === 'dark' ? '#000' : '#fff'};
  border-radius: 16px;
  width: 560px;
  height: auto;
  max-width: 95vw;
  max-height: 90vh;
  overflow-y: auto;
  animation: ${slideUp} 0.3s ease;
`;

const ModalHeader = styled.div<{ $isDark: string }>`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 5px 12px 0px 12px;
  border-bottom: 1px solid ${({ $isDark }) =>
    $isDark === 'dark'
      ? 'rgba(125, 123, 123, 0.6)'
      : 'rgba(182, 181, 181, 0.43)'};
  position: sticky;
  top: 0;
  background: ${({ $isDark }) => $isDark === 'dark' ? '#000' : '#fff'};
  z-index: 1;
`;

const CloseButton = styled.button<{ $isDark: string }>`
  background: transparent;
  border: none;
  cursor: pointer;
  color: ${({ $isDark }) => $isDark === 'dark' ? '#fff' : '#000'};
  display: flex;
  align-items: center;
  justify-content: center;
  width: 34px;
  height: 34px;
  border-radius: 50%;
  transition: background 0.15s;

  &:hover {
    background: ${({ $isDark }) => $isDark === 'dark' ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.07)'};
  }
`;


const ModalBody = styled.div`
  padding: 3px 16px 20px;
  display: flex;
  flex-direction: column;
`;

const ThreadContainer = styled.div`
  display: flex;
`;

const AvatarColumn = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 50px;
  flex-shrink: 0;
`;

const AvatarWrapper = styled.div`
  width: 40px;
  height: 40px;
  margin-top: 15px;
  border-radius: 50%;
  overflow: hidden;
  flex-shrink: 0;

  img {              
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
`;

const Line = styled.div<{ $isDark: string }>`
  width: 1px;
  flex: 1;
  min-height: 20px;
  margin-top: 4px;
  background: ${({ $isDark }) =>
    $isDark === 'dark'
      ? 'rgba(78, 87, 92, 0.93)'
      : 'rgba(78, 87, 92, 0.49)'};
  border-radius: 2px;
`;

const ContentColumn = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 6px;
`;
