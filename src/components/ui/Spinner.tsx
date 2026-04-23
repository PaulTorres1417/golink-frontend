import styled, { keyframes } from 'styled-components';

type SpinnerProps = {
  color?: string;
}
export const Spinner = ({ color }: SpinnerProps) => {
  return <SpinnerWrapper $color={color}/>;
};

const spin = keyframes`
  0% { transform: rotate(0deg) }
  100% {  transform: rotate(360deg) }
`;

const SpinnerWrapper = styled.div<{ $color?: string}>`
  width: 30px;
  height: 30px;
  border: 3px solid rgba(0, 0, 0, 0.1);
  border-top: 3px solid ${({ $color }) => $color || '#1870f4'};
  border-radius: 50%;
  animation: ${spin} 0.55s linear infinite;
`;
