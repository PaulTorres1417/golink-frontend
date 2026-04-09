import styled from "styled-components";
import { Suggestions } from './components/Suggestions';
import { TrendingPostCard } from "@/pages/trendingPost/TrendingPostCard";

export const SidebarRight = () => {
  return (
    <Container>
      <Suggestions />
      <StickyStop>
        <TrendingPostCard />
      </StickyStop>
    </Container>
  );
}

const Container = styled.div`
  width: 100%;
  padding: 0px 20px;
  display: flex;
  flex: 1;
  flex-direction: column;
  gap: 10px;
`;

const StickyStop = styled.div`
  position: sticky;
  top: 56px;
`;