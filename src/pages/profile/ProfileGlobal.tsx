import styled from "styled-components";
import { UserInformation } from "./UserInformation";
import { FaUserCircle } from "react-icons/fa";
import { useTheme } from '@/store/theme';
import { useParams, useLocation } from "react-router-dom";

export const ProfileGlobal = () => {
  const { theme } = useTheme();
  const location = useLocation();
  const { id } = useParams();
  const { data } = location.state;

  return (
    <Container>
      {/* Portada */}
      <Portada style={{ backgroundImage: data.coverphoto ? `url(${data.coverphoto})` : undefined }}>
      </Portada>

      {/* Avatar */}
      <AvatarWrapper>
        {data.avatar ? (
          <AvatarImg src={data.avatar || undefined} alt="Avatar" />
        ) : (
          <AvatarFallback $theme={theme}>
            <FaUserCircle fontSize="small" />
          </AvatarFallback>
        )}
      </AvatarWrapper>
      <ContainerI>
        <TopRow>
          <NameGroup>
            <Name>{data.name ?? "anonimus"}</Name>
            <Email>{data.email ?? "anonimus"}</Email>
          </NameGroup>
        </TopRow>
        {/* Information User */}
        <UserInformation id={id}/>

        {data.bio && <Bio $useTheme={theme}>{data.bio}</Bio>}
      </ContainerI>

    </Container>
  );
};

const Container = styled.div`
  max-width: 606px;
  width: 100%;
  position: relative;
`;

const Portada = styled.div`
  width: 100%;
  height: 250px;
  background: #476195;
  background-size: cover;
  background-position: center;
  position: relative;
  border-radius: 0 0 10px 10px;
`;

const AvatarWrapper = styled.div`
  position: relative;
  width: 150px;
  margin-left: 20px;
  margin-top: -75px;
`;

const AvatarImg = styled.img`
  width: 150px;
  height: 150px;
  object-fit: cover;
  border-radius: 50%;
  border: 4px solid white;
`;

const AvatarFallback = styled.div<{ $theme: string }>`
  width: 150px;
  height: 150px;
  background: #94a3b8;
  border-radius: 50%;

  display: flex;
  justify-content: center;
  align-items: center;

  svg {
    width: 100%;
    height: 100%;
    color: ${({ $theme }) => $theme === 'dark' ? '#474d56ff' : '#1e293b;'};
  }
`;

const ContainerI = styled.div`
  padding: 12px 20px 0 20px;
`;

const TopRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const NameGroup = styled.div`
  display: flex;
  flex-direction: column;
`;

const Name = styled.h2`
  font-size: 20px;
  font-weight: 700;
  margin: 0;
`;

const Email = styled.span`
  font-size: 14px;
`;

const Bio = styled.p<{ $useTheme: string }>`
  margin-top: 20px;
  font-size: 15px;
  line-height: 1.4;
  color: ${({ $useTheme }) => $useTheme === 'dark' ? '#9ba6b5b0' : '#444e5ce4'}
`;

