import styled from 'styled-components';
import { MdInsertEmoticon } from "react-icons/md";
import { RiListRadio } from "react-icons/ri";
import { HiOutlineLocationMarker } from "react-icons/hi";
import { IoImageOutline } from "react-icons/io5";
import type { Dispatch, RefObject, SetStateAction } from 'react';
import { useTheme } from '@/store/theme';

export const actions = [
  { Icon: IoImageOutline, type: 'file' },
  { Icon: RiListRadio },
  { Icon: MdInsertEmoticon },
  { Icon: HiOutlineLocationMarker },
];

interface ActionProps {
  text: string;
  setFile: Dispatch<SetStateAction<File | null>>;
  fileInputRef: RefObject<HTMLInputElement | null>;
  handleCreatePost: () => void;
  data?: string | null;
}
export const Actions = ({ text, setFile, fileInputRef, handleCreatePost, data }: ActionProps) => {
  const { theme } = useTheme();
  const handleFileClick = () => {
    fileInputRef.current?.click();
  }
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if(file && setFile) {
      setFile(file);
    }
  }

  return (
    <Footer>
      <Action>
        {actions.map(({ Icon, type }, i) => (
          <List 
           key={i}
           $type={type}
           $themeMode={theme}
           onClick={type === 'file'? handleFileClick : undefined }
          >
            <Icon size={22} color = '#1877F2' />
          </List>
        ))}
        <input
          ref={fileInputRef}
          type='file'
          accept='image/*,video/*'
          style={{ display: 'none'}}
          onChange={handleFileChange}
        />
      </Action>

      <PublishButton 
       $themeMode={theme}
       disabled={!text.trim()} 
       onClick={handleCreatePost}
      >
       { data ? "Repost" : "Post"}
      </PublishButton>
    </Footer>
  )
}

const Footer = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding-top: 8px;
`;

const Action = styled.div`
  display: flex;
  gap: 10px;
`;

const List = styled.div<{ $themeMode: string, $type?: string }>`
  width: 36px;
  height: 36px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  cursor: ${({ $type }) => $type === 'file' ? 'pointer' : 'not-allowed'};
  &:hover {
    background: ${({ $themeMode }) => $themeMode === 'dark' ? '#456daa55' : '#83b0f558'};
  }
`;

const PublishButton = styled.button<{ $themeMode: string }>`
  font-weight: bold;
  border: none;
  border-radius: 9999px;
  padding: 9px 23px;
  background: ${({ $themeMode }) => ($themeMode === 'dark' ? '#1877F2' : '#1877F2')};
  color: #fff;
  font-size: 15px;
  cursor: pointer;

  &:disabled {
    background: #30393dff;
    cursor: not-allowed;
  }
`;
