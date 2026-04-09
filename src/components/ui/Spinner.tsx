import styled, { keyframes } from 'styled-components';

export const Spinner = () => {
  return <SpinnerWrapper />;
};

const spin = keyframes`
  0% { transform: rotate(0deg) }
  100% {  transform: rotate(360deg) }
`;

const SpinnerWrapper = styled.div`
  width: 30px;
  height: 30px;
  border: 4px solid rgba(0, 0, 0, 0.1);
  border-top: 4px solid #1870f4;
  border-radius: 50%;
  animation: ${spin} 0.55s linear infinite;
`;
