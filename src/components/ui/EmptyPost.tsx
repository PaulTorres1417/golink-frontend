import styled from "styled-components";
import { BsCamera } from "react-icons/bs";

export const EmptyPosts = () => {
  return (
    <Container>
      <Circle>
        <BsCamera />
      </Circle>
      <Text>Aun no hay publicaciones</Text>
    </Container>
  );
}

const Container = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 16px;
  width: 100%;
  height: 80vh;
`;

const Circle = styled.div`
  width: 80px;
  height: 80px;
  border: 2px solid #96959582;
  border-radius: 50%;
  display: flex;
  justify-content: center;
  align-items: center;

  svg {
    font-size: 36px;
    color: #717171b2;
  }
`;

const Text = styled.h2`
  font-size: 20px;
  color: #717171b2;
  font-weight: 500;
  text-align: center;
`;