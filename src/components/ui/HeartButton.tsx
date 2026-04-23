import { useState } from 'react';
import styled, { keyframes, css } from 'styled-components';
import { HeartFilledIcon, HeartIcon } from "./Icons";

type HeartButtonProps = {
  reaction: boolean;
  count: number;
  onToggle: () => void;
  theme: string;
  isColor: boolean;
}

export const HeartButton = ({ reaction, count, onToggle, theme, isColor }: HeartButtonProps) => {
  const [animate, setAnimate] = useState(false);

  const handleClick = () => {
    setAnimate(true);
    setTimeout(() => setAnimate(false), 700);
    onToggle();
  };

  return (
    <Wrapper onClick={handleClick} $theme={theme} $isColor={isColor}>
      <IconWrapper $reaction={reaction} $animate={animate} $theme={theme} $isColor={isColor}>
        {animate && <Ripple $reaction={reaction} />}
        {animate && <HeartAura $reaction={reaction} />}
        {animate && <HeartAura2 $reaction={reaction} />}
        {animate && (
          <Particles>
            {[...Array(6)].map((_, i) => (
              <Particle key={i} $index={i} $reaction={reaction} />
            ))}
          </Particles>
        )}
        <IconInner $reaction={reaction} $animate={animate}>
          {reaction
            ? <HeartFilledIcon size={isColor ? 19 : 22} />
            : <HeartIcon size={isColor ? 19 : 22} />
          }
        </IconInner>
      </IconWrapper>
      <Count $reaction={reaction} $hasCount={count > 0} $theme={theme}>
        {count > 0 ? count : ''}
      </Count>
    </Wrapper>
  );
};

// Animaciones
const rippleAnim = keyframes`
  0%   { transform: scale(0); opacity: 0.4; }
  100% { transform: scale(2.5); opacity: 0; }
`;

const heartPop = keyframes`
  0%   { transform: scale(1); }
  30%  { transform: scale(1.4); }
  60%  { transform: scale(0.9); }
  100% { transform: scale(1); }
`;

const particleAnim = (angle: number) => keyframes`
  0%   { transform: rotate(${angle}deg) translateY(0px); opacity: 1; }
  100% { transform: rotate(${angle}deg) translateY(22px); opacity: 0; }
`;

const auraAnim = keyframes`
  0%   { transform: scale(0.8); opacity: 0.6; }
  50%  { transform: scale(1.2); opacity: 0.3; }
  100% { transform: scale(1.5); opacity: 0; }
`;


const IconWrapper = styled.div<{ 
  $reaction: boolean; 
  $animate: boolean; 
  $theme: string;
  $isColor: boolean;
}>`
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  border-radius: 50%;
  color: ${({ $reaction, $theme, $isColor }) =>
    $reaction
    ? 'rgb(249, 24, 128)'
      : $isColor
        ? ($theme === 'dark'
          ? '#a8b3cfbe'
          : 'rgba(83, 100, 113, 1)')
        : ($theme === 'dark'
          ? '#a8b3cfbe'
          : 'rgba(83, 100, 113, 1)')
  };
`;

const Count = styled.span<{ $reaction: boolean, $hasCount: boolean, $theme: string }>`
  font-size: 14px;
  min-width: 16px;
  color: ${({ $reaction, $theme, $hasCount }) =>
    $reaction
      ? '#e83e77d0'
      : $hasCount
        ? ($theme === 'dark' 
          ? 'rgba(123, 134, 146, 1)' 
          : 'rgba(83, 100, 113, 1)')
        : ($theme === 'dark'
          ? 'rgba(123, 134, 146, 1)'
          : 'rgba(83, 100, 113, 0.58)')};
  transition: color 0.2s ease;
`;

const Wrapper = styled.div<{ $theme: string, $isColor: boolean }>`
  display: flex;
  align-items: center;
  gap: 4px;
  cursor: pointer;
  user-select: none;
  border-radius: 20px;
  padding: 0px 4px 0px 4px;

  &:hover ${IconWrapper} {
    color: #ed3364f5;
  }
  &:hover ${Count} {
    color: #ed3364f5;
  }
`;

const IconInner = styled.div<{ $reaction: boolean; $animate: boolean }>`
  display: flex;
  align-items: center;
  ${({ $animate }) => $animate && css`
    animation: ${heartPop} 0.4s ease forwards;
  `}
`;

const Ripple = styled.div<{ $reaction: boolean }>`
  position: absolute;
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background: ${({ $reaction }) => $reaction ? 'rgba(232, 62, 119, 0.3)' : 'rgba(113, 118, 123, 0.3)'};
  animation: ${rippleAnim} 0.5s ease-out forwards;
  pointer-events: none;
`;

const HeartAura = styled.div<{ $reaction: boolean }>`
  position: absolute;
  width: 100%;
  height: 100%;
  border-radius: 50%;
  border: 2px solid ${({ $reaction }) => $reaction ? '#e83e77' : '#aaa'};
  animation: ${auraAnim} 0.6s ease-out forwards;
  pointer-events: none;
`;

const HeartAura2 = styled(HeartAura)`
  animation: ${auraAnim} 0.6s ease-out 0.1s forwards;
  border-color: ${({ $reaction }) => $reaction ? '#f472b6' : '#ccc'};
`;

const ANGLES = [0, 60, 120, 180, 240, 300];

const Particle = styled.div<{ $index: number; $reaction: boolean }>`
  position: absolute;
  width: 5px;
  height: 5px;
  border-radius: 50%;
  background: ${({ $reaction }) => $reaction ? '#e83e77' : '#aaa'};
  animation: ${({ $index }) => css`${particleAnim(ANGLES[$index])} 0.6s ease-out forwards`};
  pointer-events: none;
`;

const Particles = styled.div`
  position: absolute;
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  pointer-events: none;
`;

