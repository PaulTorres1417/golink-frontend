import styled from "styled-components";
import { LuSearch } from "react-icons/lu";
import { useRef, useState } from "react";
import { useTheme } from "../../../store/theme/ThemeContext";
import { ModalSearch } from "../../features/user/modals/ModalSearch";

export const Search = () => {
  const [isOpenModalSearch, setIsOpenModalSearch] = useState<boolean>(false);
  const [isFocused, setIsFocused] = useState<boolean>(false);
  const [searchValue, setSearchValue] = useState<string>('');
  const { theme } = useTheme();
  const imputRef = useRef<HTMLInputElement>(null);
  const themeColor = theme === 'dark' ? '#fff' : '#707e87bd';

  return (
    <Container
      $themeMode={theme}
      $focused={isFocused}
      onClick={(e) => {
        e.stopPropagation();
        setIsOpenModalSearch(true);
        imputRef.current?.focus();
      }}
    >
      <IconWrapper $themeMode={theme}>
        <LuSearch style={{ fontSize: '16px', color: themeColor, marginLeft: '8px' }} />
      </IconWrapper>
      <Input
        $themeMode={theme}
        value={searchValue}
        onChange={(e) => setSearchValue(e.target.value)}
        ref={imputRef}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        placeholder="Search in Golinx"
      />
      {isOpenModalSearch 
        && <ModalSearch 
            setIsOpenModalSearch={setIsOpenModalSearch}
            searchValue={searchValue.toLocaleLowerCase()}
            setSearchValue={setSearchValue}
            />
      }
    </Container>
  );
};

const Container = styled.div<{ $themeMode: string; $focused: boolean }>`
  display: flex;
  position: relative;
  align-items: center;
  width: 100%;
  max-width: 500px;
  height: 40px;
  background: ${({ $themeMode }) =>
    $themeMode === 'dark' ? '#30393dff' : '#f6f7f8'};
  border: 2px solid ${({ $focused, $themeMode }) =>
    $focused
      ? '#1870f4'
      : $themeMode === 'dark'
        ? 'transparent'
        : 'rgba(119, 117, 117, 0.31)'
  };
  border-radius: 20px;
  padding: 0 14px 0 10px;

  &:hover {
    border-color: ${({ $focused }) => $focused ? '#1870f4' : 'transparent'};
    background: ${({ $themeMode, $focused }) =>
    $focused
      ? 'transparent'
      : $themeMode === 'dark'
        ? '#48545bc7'
        : 'rgba(119, 117, 117, 0.31)'};
  }
`;

const IconWrapper = styled.div<{ $themeMode: string }>`
  display: flex;
  align-items: center;
  margin-right: 10px;
  color: ${({ $themeMode }) =>
   $themeMode === 'dark'
        ? 'rgba(255,255,255,0.4)'
        : '#878a8c'};
  flex-shrink: 0;
`;

const Input = styled.input<{ $themeMode: string }>`
  flex: 1;
  border: none;
  outline: none;
  font-size: 15px;
  background: transparent;
  color: ${({ $themeMode }) => $themeMode === 'dark' ? '#fff' : '#000'};

  &::placeholder {
    color: ${({ $themeMode }) =>
    $themeMode === 'dark' ? '#85949dcf' : '#707e87bd'};
    font-size: 15px;
  }
`;