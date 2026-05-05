import { useTheme } from "@/store";
import { FaUserCircle } from "react-icons/fa";
import styled from "styled-components";

const cloudinaryAvatar = (url: string, size: number) => {
  return url.replace(
    '/upload/',
    `/upload/w_${size},h_${size},c_fill,f_auto,q_auto/`
  );
};

interface UserProps {
  avatarUrl?: string | null;
  size?: number;
}

export const Avatar = ({ avatarUrl, size = 40 }: UserProps) => {
  const { theme } = useTheme();

  return (
    <AvatarContainer $size={size}>
      {avatarUrl ? (
        <img
          src={cloudinaryAvatar(avatarUrl, size)}
          srcSet={`
            ${cloudinaryAvatar(avatarUrl, size)} 1x,
            ${cloudinaryAvatar(avatarUrl, size * 2)} 2x
          `}
          alt="avatar"
          width={size}
          height={size}
        />
      ) : (
        <AvatarFallback $theme={theme} $size={size}>
        <FaUserCircle size={size} />
        </AvatarFallback>
      )}
    </AvatarContainer>
  );
};

const AvatarContainer = styled.div<{ $size: number }>`
  flex-shrink: 0;
  display: flex;
  justify-content: center;
  width: ${({ $size }) => $size}px;
  height: ${({ $size }) => $size}px;
  img {
    width: ${({ $size }) => $size}px;
    height: ${({ $size }) => $size}px;
    border-radius: 50%;
    object-fit: cover;
  }
`;

const AvatarFallback = styled.div<{ $theme: string, $size: number }>`
  width: ${({ $size }) => $size}px;
  height: ${({ $size }) => $size}px;
  background: ${({ $theme }) => $theme === 'dark' ? '#000' : '#fff'};
  border-radius: 50%;
  display: flex;
  justify-content: center;
  align-items: center;

  svg {
    width: ${({ $size }) => $size}px;
    height: ${({ $size }) => $size}px;
    color: ${({ $theme }) => $theme === 'dark' ? '#94a3b8' : '#94a3b8;'};
  }
`;