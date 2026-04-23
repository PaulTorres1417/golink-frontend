import styled from "styled-components";
import { Search } from "./components/Search";
import { useAuthStore, useTheme } from "@/store";
import { Notifications } from './components/Notifications'

export const NavBarCenter = () => {
  const user = useAuthStore((state) => state.user);
  const { theme } = useTheme();
  return (
    <>
      <NavBarContainer $theme={theme}>
        <CenterSection>
          <Search />
        </CenterSection>
      </NavBarContainer>
      {user && <Notifications />}
    </>
  );
};

const NavBarContainer = styled.nav<{ $theme: string }>`
  position: sticky;
  top: 0;
  width: 100%;
  height: 56px;
  display: flex;      
  align-items: center;
  z-index: 800;
  backdrop-filter: blur(10px);
  border-bottom: 1px solid ${({ $theme }) => 
    $theme === 'dark' 
      ? '#6f778b32' 
      : '#a8b3cf62'};
  border-left: 1px solid ${({ $theme }) => 
    $theme === 'dark' 
      ? '#6f778b32' 
      : '#a8b3cf62'};
`;

const CenterSection = styled.div`
  flex: 1;
  display: flex;
  justify-content: center;
  align-items: center;
  height: 55px;
  margin: 0 15px;
`;
