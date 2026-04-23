import styled from "styled-components";
import { SlOptions } from "react-icons/sl";
import { useState } from "react";
import { ModalExit } from "../../ui/ModalExit";
import { useAuthStore } from "../../../store/auth/useAuthStore";
import { FaUserCircle } from "react-icons/fa";
import { useTheme } from "../../../store/theme/ThemeContext";

export const ProfileUser = ({ isCollapsed }: { isCollapsed: boolean }) => {
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const user = useAuthStore((state) => state.user);
  const { theme } = useTheme();

  return (

    <Container
      $theme={theme}
      $isCollapsed={isCollapsed}
      onClick={(e) => {
        e.stopPropagation();
        setIsModalOpen((prev) => !prev);
      }}>
      <Avatar>
        {
          user?.avatar ? (
            <img src={user.avatar} alt={user.avatar} />
          ) : (
            <FaUserCircle size={37} />
          )
        }
      </Avatar>
      <Information $isCollapsed={isCollapsed} $theme={theme}>
        <h2>
          {user?.name
            .split("@")[0]
            .slice(0, 13)
            .concat(user.name.split("@")[0].length > 13 ? ".." : "")
          }
        </h2>
        <p>
          @{user?.email
            ? user.email.split("@")[0].slice(0, 13) + (user.email.split("@")[0].length > 13 ? "..." : "")
            : "usuario"}
        </p>
      </Information>
      <Option $isCollapsed={isCollapsed}>
        <SlOptions />
      </Option>

      {/* modal */}
      {isModalOpen &&
        <ModalExit
          setIsModalOpen={setIsModalOpen}
          isCollapsed={isCollapsed}
        />
      }
    </Container>
  )
}

const Container = styled.div<{ $isCollapsed: boolean, $theme: string }>`
  display: flex;
  justify-content: flex-start;
  padding: 7px;
  align-items: center;
  width: 230px;
  height: 80px;
  cursor: pointer;
  border-radius: 30px;
  border: 1px solid ${({ $theme }) =>
    $theme === 'dark'
      ? '#6f778b32'
      : '#a8b3cf62'};
  position: relative; 

  ${({ $isCollapsed }) => $isCollapsed && `
    width: 50px;
    border: none;
    justify-content: center;
  `}
`;

const Avatar = styled.div`
   margin: 15px;
   flex-shrink: 0;
   img {
      width: 42px;
      height: 42px;
      border-radius: 50%;
      object-fit: cover;
   }
`;

const Information = styled.div<{ $isCollapsed?: boolean, $theme: string }>`
  width: 200px;

  h2 {
   font-size: 14px;
   font-weight: bold;
  }
  p {
   font-size: 14px;
   color: ${({ $theme }) => $theme === 'dark' ? '#8698c4ff' : '#5f6b89ff'};
  }

  ${({ $isCollapsed }) => $isCollapsed && `
     display: none; 
  `}
`;

const Option = styled.div<{ $isCollapsed?: boolean }>`
  width: 50px;
  display: flex;
  align-items: center;
  justify-content: center;

  ${({ $isCollapsed }) => $isCollapsed && `
     display: none; 
  `}
`;


