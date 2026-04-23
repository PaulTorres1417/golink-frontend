import styled from 'styled-components';
import { NavLink } from 'react-router-dom';
import { useTheme } from '@/store/theme';
import { PostButton } from './components/PostButton';
import { ProfileUser } from './components/ProfileUser';
import { useSidebarWidth } from '@/hooks/sidebar';
import { FiHome, FiSearch, FiUsers, FiBell, FiBookmark, FiSettings, FiUser, FiMoon, FiSun } from 'react-icons/fi';
import { useEffect, useState } from 'react';

const sidebarItems = [
  { label: 'Home', icon: FiHome, to: '/' },
  { label: 'Explore', icon: FiSearch, to: 'explore' },
  { label: 'Friends', icon: FiUsers, to: 'friends' },
  { label: 'Notifications', icon: FiBell, to: 'notifications' },
  { label: 'Bookmarks', icon: FiBookmark, to: 'bookmarks' },
  { label: 'Theme', icon: FiMoon, to: 'x' },
  { label: 'Profile', icon: FiUser, to: 'profile' },
  { label: 'Setting', icon: FiSettings, to: 'setting' },
];

export const SidebarLeft = () => {
  const { theme, toggleTheme } = useTheme();
  const sidebarWidth = useSidebarWidth();
  const [isCollapsed, setIsCollapsed] = useState(window.innerWidth < 1265);

  useEffect(() => {
    const handleResize = () => setIsCollapsed(window.innerWidth < 1265);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <Outer style={{ width: `${sidebarWidth}px` }}>
      <Inner $collapsed={isCollapsed}>
        <TopSection $collapsed={isCollapsed}>
          <LogoWrapper $collapsed={isCollapsed}>
            <h2>{isCollapsed ? 'GO' : 'Golinx'}</h2>
          </LogoWrapper>

          <List>
            {sidebarItems.map(({ label, icon: IconComponent, to }) => {
              if (label === 'Theme') {
                return (
                  <ListItem key={label} $collapsed={isCollapsed} onClick={toggleTheme}>
                    <StyledItemWrapper $collapsed={isCollapsed}>
                      <Icon>
                        {theme === 'light'
                          ? <FiMoon size={20} />
                          : <FiSun size={20} />}
                      </Icon>
                      <Label $collapsed={isCollapsed}>{label}</Label>
                    </StyledItemWrapper>
                  </ListItem>
                );
              }

              return (
                <ListItem key={label} $collapsed={isCollapsed}>
                  <StyledNavLink to={to} $collapsed={isCollapsed}>
                    {({ isActive }) => (
                      <>
                        <Icon
                          style={{
                            opacity: isActive ? 1 : 0.7,
                            transform: isActive ? 'scale(1.05)' : 'scale(1)',
                            transition: 'transform 0.2s ease, opacity 0.2s ease',
                            willChange: 'transform, opacity',
                          }}
                        >
                          <IconComponent size={20} />
                        </Icon>
                        <Label $collapsed={isCollapsed}>{label}</Label>
                      </>
                    )}
                  </StyledNavLink>
                </ListItem>
              );
            })}
          </List>

          <PostButton isCollapsed={isCollapsed} />
        </TopSection>

        <ProfileUser isCollapsed={isCollapsed} />
      </Inner>
    </Outer>
  );
};

const Outer = styled.div`
  position: sticky;
  top: 0;
  height: 100vh;
  z-index: 100;
  overflow: hidden;
`;

const Inner = styled.div<{ $collapsed: boolean }>`
  position: absolute;
  top: 0;
  right: 0;
  height: 100%;
  width: 250px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  padding: 0 12px 20px 0;
  transition: width 0.2s ease;

  ${({ $collapsed }) => $collapsed && `
    width: 120px;
    align-items: flex-end;
    padding: 0 8px 10px 0;
  `}
`;

const TopSection = styled.div<{ $collapsed: boolean }>`
  display: flex;
  flex-direction: column;
  width: 250px;
  transition: width 0.2s ease;

  ${({ $collapsed }) => $collapsed && `
    width: auto;
    align-items: center;
  `}
`;

const LogoWrapper = styled.div<{ $collapsed: boolean }>`
  display: flex;
  align-items: center;
  padding: 11.4px 20px 11.4px 7px;
  transition: all 0.2s ease;

  h2 {
    font-size: 28px;
    font-weight: 800;
    font-family: "Chirp", system-ui, sans-serif;
    white-space: nowrap;
    transition: opacity 0.2s ease, transform 0.2s ease;
  }

  ${({ $collapsed }) => $collapsed && `
    justify-content: flex-end;
    padding: 12px 0;
  `}
`;

const List = styled.ul`
  list-style: none;
  width: 100%;
`;

const ListItem = styled.li<{ $collapsed: boolean }>`
  width: 100%;
  height: 60px;
  padding: 13px 20px 13px 7px;
  cursor: pointer;
  display: flex;
  justify-content: center;
  align-items: center;

  ${({ $collapsed }) => $collapsed && `
    display: flex;
    flex-direction: column;
    height: 70px;
    padding: 9px 0px;
  `}
`;

const StyledNavLink = styled(NavLink) <{ $collapsed: boolean }>`
  display: flex;
  align-items: center;
  justify-content: flex-start;
  gap: 14px;
  text-decoration: none;
  color: inherit;
  width: 100%;
  height: 100%;

  ${({ $collapsed }) => $collapsed && `
    justify-content: center;
    flex-direction: column;
  `}
`;

const Icon = styled.span`
  display: flex;
  align-items: center;
  justify-content: center;
`;

const StyledItemWrapper = styled.div<{ $collapsed: boolean }>`
  display: flex;
  align-items: center;
  justify-content: flex-start;
  gap: 12px;
  width: 100%;
  height: 100%;

  ${({ $collapsed }) => $collapsed && `
    flex-direction: column;
    justify-content: center;
  `}
`;

const Label = styled.span<{ $collapsed: boolean }>`
  font-size: 21px;
  font-family: "Chirp", system-ui, -apple-system, BlinkMacSystemFont,
    "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
  line-height: 1;
  transition: opacity 0.2s ease, transform 0.2s ease;
  opacity: 1;
  white-space: nowrap;

  ${({ $collapsed }) => $collapsed && `
    display: none;
  `}
`;