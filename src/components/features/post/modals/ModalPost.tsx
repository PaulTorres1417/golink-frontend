import styled, { keyframes } from "styled-components";
import { createPortal } from "react-dom";
import { useTheme, useAuthStore } from '@/store';
import { PostForm } from "../PostForm";
import { IoClose } from "react-icons/io5";
import { FaUserCircle } from "react-icons/fa";

type RepostModalProps = {
  onClose: () => void;
}

export const ModalPost = ({ onClose }: RepostModalProps) => {
  const user = useAuthStore((state) => state.user);
  const { theme } = useTheme();

  const handleBackdrop = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (e.target === e.currentTarget) onClose();
  };

  return createPortal(
    <Backdrop onClick={handleBackdrop}>
      <Modal $theme={theme} onClick={(e) => e.stopPropagation()}>

        <ModalHeader $theme={theme}>
          <CloseButton $theme={theme}
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
            </AvatarColumn>

            <ContentColumn>
              <PostForm 
               hideAvatar={true} 
               border={true}
               onClose={onClose} 
              />
            </ContentColumn>
          </ThreadContainer>
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

const Modal = styled.div<{ $theme: string }>`
  background: ${({ $theme }) => $theme === 'dark' ? '#000' : '#fff'};
  border-radius: 16px;
  width: 560px;
  height: auto;
  max-width: 95vw;
  max-height: 90vh;
  overflow-y: auto;
  animation: ${slideUp} 0.3s ease;
`;

const ModalHeader = styled.div<{ $theme: string }>`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 5px 12px 0px 12px;
  border-bottom: 1px solid ${({ $theme }) =>
    $theme === 'dark' 
      ? 'rgba(132, 130, 130, 0.37)' 
      : 'rgba(197, 197, 197, 0.41)'};
  position: sticky;
  top: 0;
  background: ${({ $theme }) => $theme === 'dark' ? '#000' : '#fff'};
  z-index: 1;
`;

const CloseButton = styled.button<{ $theme: string }>`
  background: transparent;
  border: none;
  cursor: pointer;
  color: ${({ $theme }) => 
    $theme === 'dark' 
      ? '#fff' 
      : '#000'};
  display: flex;
  align-items: center;
  justify-content: center;
  width: 34px;
  height: 34px;
  border-radius: 50%;
  transition: background 0.15s;

  &:hover {
    background: ${({ $theme }) => 
      $theme === 'dark' 
      ? 'rgba(255,255,255,0.1)' 
      : 'rgba(0,0,0,0.07)'};
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

const ContentColumn = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 6px;
`;
