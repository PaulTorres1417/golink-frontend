import styled from "styled-components";
import { useState } from "react";
import { ModalPost } from '../../features/post/modals/ModalPost';
import { useTheme } from "../../../store/theme/ThemeContext";
import { PostIcon } from '@components/ui/Icons';

export const PostButton = ({ isCollapsed }: { isCollapsed: boolean }) => {
  const [isOpenModal, setIsOpenModal] = useState<boolean>(false);
  const { theme } = useTheme();

  return (
    <>
      <Container
        onClick={() => setIsOpenModal((prev) => !prev)}
        $isCollapsed={isCollapsed}
      >
        <Button 
         $isCollapsed={isCollapsed}
         $themeColor={theme}>Post
        </Button>
        <IconButton $isCollapsed={isCollapsed} $theme={theme}>
          <PostIcon size={22} />
        </IconButton>
      </Container>
      {isOpenModal && <ModalPost onClose={() => setIsOpenModal(false)} />}
    </>
  )
}

const Container = styled.div<{ $isCollapsed: boolean }>`
    bottom: 120px;
    margin-top: 12px;
    display: flex;
    justify-content: flex-end;
    padding-right: 20px;
    z-index: 100;

    ${({ $isCollapsed }) => $isCollapsed && `
      width: auto;
      justify-content: center;
      padding-right: 0;
    `}
`;
const Button = styled.div<{ $themeColor: string, $isCollapsed?: boolean }>`
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 7px;
    background: ${({ $themeColor }) => ($themeColor === 'dark' ? '#fff' : '#000')};
    color: ${({ $themeColor }) => ($themeColor === 'dark' ? '#000' : '#fff')};
    width: 250px;
    height: 55px;
    font-weight: bold;
    border-radius: 30px;
    cursor: pointer;
    font-size: 18px;
    
    ${({ $isCollapsed }) => $isCollapsed && `
        display: none;
    `}
`;
const IconButton = styled.button<{ $isCollapsed?: boolean, $theme: string }>`
    display: none;
    justify-content: center;
    align-items: center;
    padding: 10px;
    width: 50px;
    height: 50px;
    margin: 8px;
    border-radius: 50%;
    cursor: pointer;
    border: none;

    ${({ $isCollapsed, $theme }) => $isCollapsed && `
        display: flex;
        border: 1px solid ${$theme === 'dark' ? '#fff' : '#000'};
        padding: 0;
        margin: 0;
    `}
`;