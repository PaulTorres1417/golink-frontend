import styled from "styled-components";
import { Outlet } from "react-router-dom";
import { SidebarLeft } from "./SidebarLeft";
import { SidebarRight } from "./SidebarRight";
import { NavBarRight } from "./NavBarRight";
import { NavBarCenter } from "./NavBarCenter";
import { useSidebarWidth } from "@/hooks/sidebar";
import { Suspense } from "react";
import { Spinner } from "@/components/ui";
import { useTheme } from "@/store/theme";

export const Layout = () => {
  const sidebarWidth = useSidebarWidth();
  const { theme } = useTheme();

  return (
    <Container>
      <LeftSidebar style={{ width: `${sidebarWidth}px` }}>
        <SidebarLeft />
      </LeftSidebar>

      <CenterColumn $theme={theme}>
        <NavBarCenter />
        <CenterContent $theme={theme}>
          <Suspense fallback={<Centered><Spinner /></Centered>}>
            <Outlet />
          </Suspense>
        </CenterContent>
      </CenterColumn>

      <RightColumn>
        <NavBarRight />
        <SidebarRight />
      </RightColumn>
    </Container>
  );
};

const Container = styled.div`
  display: flex;
  width: 100%;
  max-width: 1440px;
  min-height: 100vh;
  margin: auto;
`;

const LeftSidebar = styled.aside` 
  display: flex;
  flex-direction: column;
  flex-shrink: 0;    
`;

const Centered = styled.div`
  position: absolute;
  top: 25%;
  left: 50%;
  transform: translate(-50%, -50%);
`;

const CenterColumn = styled.div<{ $theme: string }>`
  flex: 1;
  min-width: 0;
  max-width: 600px;
  display: flex;
  flex-direction: column;
  border-right: 1px solid ${({ $theme }) => 
    $theme === 'dark' 
      ? '#6f778b32' 
      : '#a8b3cf62'};
`;

const CenterContent = styled.main<{ $theme: string }>`
  display: flex;
  flex: 1;
  align-items: flex-start;
  position: relative;
  justify-content: center;
  border-left: 1px solid ${({ $theme }) => 
    $theme === 'dark' 
      ? '#6f778b32' 
      : '#a8b3cf62'};
`;

const RightColumn = styled.aside`
  width: 370px;
  flex-shrink: 0;
  display: flex;
  flex-direction: column;
  align-self: stretch;
  top: 0;

  @media (max-width: 950px) {
    display: none;
  }
`;
