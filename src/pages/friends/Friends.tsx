// src/pages/InDevelopment.tsx
import styled from 'styled-components';
import { MdOutlineConstruction } from 'react-icons/md';
import { useTheme } from '../../store/theme/ThemeContext';

export const Friends = () => {
  const { theme } = useTheme();
  return (
    <Container $theme={theme}>
      <MdOutlineConstruction size={50} color="#7e7d7dc1" />
      <Title>Under Development</Title>
      <Message>This section is under construction. Coming soon.</Message>
    </Container>
  );
};

const Container = styled.div<{ $theme: string }>`
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
  gap: 16px;
  padding: 60px 20px;
  color: ${({ $theme }) => $theme === 'dark' ? '#acbdc6' : '#302f2f'};
`;

const Title = styled.h2`
  font-size: 22px;
  font-weight: 700;
`;

const Message = styled.p`
  font-size: 15px;
  color: #888;
  text-align: center;
`;