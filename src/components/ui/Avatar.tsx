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
}

export const Avatar: React.FC<UserProps> = ({ avatarUrl }) => {
  return (
    <AvatarContainer>
      {avatarUrl ? (
        <img
          src={cloudinaryAvatar(avatarUrl, 40)}
          srcSet={`
            ${cloudinaryAvatar(avatarUrl, 40)} 1x,
            ${cloudinaryAvatar(avatarUrl, 80)} 2x
          `}
          alt="avatar"
          width={40}
          height={40}
        />
      ) : (
        <FaUserCircle size={40} />
      )}
    </AvatarContainer>
  );
};

const AvatarContainer = styled.div`
  flex-shrink: 0;
  display: flex;
  margin-top: 4px;
  justify-content: center;
  width: 40px;
  height: 100%;
  img {
    width: 40px;
    height: 40px;
    border-radius: 50%;
    object-fit: cover;
  }
`;