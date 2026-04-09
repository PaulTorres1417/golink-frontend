import styled from 'styled-components';
import { Post } from "@/components/features/post/Post";
import { PostForm } from '@/components/features/post/PostForm';

export const Home = () => {

  return (
    <Container>
      <PostForm 
       hideAvatar={false}
       border={false}
      />
      <Post />
    </Container>
  );
};

const Container = styled.section`
  width: 100%;
  max-width: 610px;
`