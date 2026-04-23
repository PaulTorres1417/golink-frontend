import styled from 'styled-components';
import { useId } from 'react';
import { useTheme } from '@/store/theme';

interface EditorProps {
  text: string;
  setText: (value: string) => void;
  name?: string | null;
  size: string;
  data?: string | null;
}
export const Editor = ({ text, setText, name, size, data }: EditorProps) => {
  const { theme } = useTheme();
  const id = useId();

  return (
    <Container>
      <FakeInput
        id={id}
        name={id}
        maxLength={300}
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder={data? "Comment" : `What's happening, ${name?.split(" ")[0]}?`}
        $size={size}
        $themeMode={theme}
      />
    </Container>
  )
}

const FakeInput = styled.textarea<{$size: string, $themeMode: string}>`
  width: 100%;
  font-family: Arial, sans-serif;
  background: transparent;
  height: ${({$size}) => $size};
  padding: 12px 5px;
  font-size: 17px;
  border: none;
  outline: none;
  resize: none;
  color: ${({ $themeMode }) => 
    ($themeMode === 'dark' 
      ? '#fff' 
      : '#000')};
  &::placeholder {
    color: ${({ $themeMode}) => 
      $themeMode === 'dark' 
        ? '#d8dce7' 
        : '#5f6b89ff'};
    font-size: 20px;
  }
`;
const Container = styled.div`
  max-width: 518px;
`;