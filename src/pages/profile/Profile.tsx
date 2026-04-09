import styled from "styled-components";
import { useState } from "react";
import { gql } from "@apollo/client";
import { useMutation } from "@apollo/client/react";
import { GET_SIGNATURE } from "@/graphql/mutation";
import type { GenerateUploadSignatureResponse } from "@features/post/types";
import { useAuthStore, useTheme } from "@/store";
import { UserInformation } from "./UserInformation";
import { ModalUserInformation } from "@features/user/modals";
import { FaUserCircle } from "react-icons/fa";
import { FiCamera } from "react-icons/fi";

const SAVE_IMAGE_PERFIL = gql`
  mutation Save_image_pefil($type: String!, $image: String!) {
    saveImagePerfil(type: $type, image: $image) 
  }
`;

export const Profile = () => {
  const [modalType, setModalType] = useState<"portada" | "avatar" | null>(null);
  const user = useAuthStore((state) => state.user);
  const setUser = useAuthStore((state) => state.setUser);
  const [openModel, setOpenModel] = useState<boolean>(false);
  const { theme } = useTheme();
  const id = user?.id;

  const handleImageUpdate = (type: "portada" | "avatar", imageUrl: string) => {
    if (user) {
      setUser({
        ...user,
        ...(type === "portada" ?
          { coverphoto: imageUrl } :
          { avatar: imageUrl }
        )
      })
    }
  }

  console.log(user?.avatar)
  return (
    <Container>
      {/* Portada */}
      <Portada style={{ backgroundImage: user?.coverphoto ? `url(${user.coverphoto})` : undefined }}>
        <EditCoverButton onClick={() => setModalType("portada")}>
          <FiCamera size={18} />
        </EditCoverButton>
      </Portada>

      {/* Avatar */}
      <AvatarWrapper>
        {user?.avatar ? (
          <AvatarImg src={user.avatar} alt="" />
        ) : (
          <AvatarFallback $theme={theme}>
            <FaUserCircle size={18} />
          </AvatarFallback>
        )}
        <EditAvatarButton onClick={() => setModalType("avatar")}>
          <FiCamera size={18} />
        </EditAvatarButton>
      </AvatarWrapper>
      <ContainerI>
        <TopRow>
          <NameGroup>
            <Name>{user?.name ?? "anonimus"}</Name>
            <Username>{user?.email ?? "anonimus"}</Username>
          </NameGroup>

          <EditButton $useTheme={theme} onClick={() => setOpenModel(!openModel)}>Editar perfil</EditButton>
        </TopRow>

        {/* Information User */}
        <UserInformation id={id} />

        {user?.bio && <Bio $useTheme={theme}>{user.bio}</Bio>}
        {
          openModel &&
          <ModalUserInformation isOpen={openModel} setOpenModel={setOpenModel} />
        }
      </ContainerI>


      {modalType && (
        <UploadModal
          type={modalType}
          close={() => setModalType(null)}
          onImageUpdated={handleImageUpdate}
        />
      )}
    </Container>
  );
};

const UploadModal = ({
  type,
  close,
  onImageUpdated,
}: {
  type: "portada" | "avatar";
  close: () => void;
  onImageUpdated: (type: "portada" | "avatar", imageUrl: string) => void;
}) => {
  const [preview, setPreview] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [Save_image_pefil] = useMutation(SAVE_IMAGE_PERFIL);
  const [uploadFile, setUploadFile] = useState<File | null>(null);
  const [getSignature] = useMutation<GenerateUploadSignatureResponse>(GET_SIGNATURE);

  const handleUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadFile(file);

    const reader = new FileReader();
    reader.onload = () => setPreview(reader.result as string);
    reader.readAsDataURL(file);
  };

  const saveImagePerfil = async () => {

    if (!preview || !uploadFile) return;
    setUploading(true);
    let imageUrl = null;

    if (type) {
      const { data } = await getSignature({ variables: { folder: type } });
      if (!data) {
        setUploading(false);
        return;
      };
      const { timestamp, cloudName, apikey, signature } = data.generateUploadSignature;

      const formData = new FormData();
      formData.append("file", uploadFile!);
      formData.append("api_key", apikey);
      formData.append("timestamp", timestamp.toString());
      formData.append("signature", signature);
      formData.append("folder", type);

      const res = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/auto/upload`, {
        method: "POST",
        body: formData,
      });
      const uploaded = await res.json();
      imageUrl = uploaded.secure_url;
    }

    try {
      await Save_image_pefil({
        variables: {
          type,
          image: imageUrl
        }
      })

      onImageUpdated(type, imageUrl);
      close();

    } catch (error) {
      console.error("Error saving image:", error);
    }
  }

  return (
    <ModalOverlay onClick={close}>
      <Modal onClick={(e) => e.stopPropagation()}>
        <ModalTitle>{type === "portada" ? "Cambiar portada" : "Cambiar foto de perfil"}</ModalTitle>

        {preview ? (
          <PreviewImage src={preview} />
        ) : (
          <EmptyPreview>
            <UploadLabel htmlFor="uploadInput">
              <FiCamera size={40} style={{ opacity: 0.85 }} />
              <span>Subir imagen</span>
            </UploadLabel>
          </EmptyPreview>
        )}

        <HiddenInput id="uploadInput" type="file" accept="image/*" onChange={handleUpload} />

        <ButtonsRow>
          <CancelButton onClick={close}>Cancelar</CancelButton>
          <SaveButton disabled={!preview || uploading} onClick={saveImagePerfil}>
            {uploading ? "Guardando..." : "Guardar"}
          </SaveButton>
        </ButtonsRow>
      </Modal>
    </ModalOverlay>
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

const EditCoverButton = styled.button`
  position: absolute;
  right: 15px;
  bottom: 15px;
  background: rgba(0, 0, 0, 0.55);
  border: none;
  padding: 8px;
  border-radius: 50%;
  cursor: pointer;
  color: white;
  transition: 0.2s ease;

  &:hover {
    background: rgba(0, 0, 0, 0.75);
  }
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

const EditAvatarButton = styled.button`
  position: absolute;
  bottom: 4px;
  right: 4px;
  background: rgba(0, 0, 0, 0.55);
  border: none;
  border-radius: 50%;
  width: 42px;
  height: 42px;
  cursor: pointer;
  color: white;
  display: flex;
  justify-content: center;
  align-items: center;

  &:hover {
    background: rgba(0, 0, 0, 0.75);
  }
`;

const PreviewImage = styled.img`
  width: 100%;
  border-radius: 10px;
  max-height: 260px;
  object-fit: cover;
  margin-bottom: 15px;
`;

const EmptyPreview = styled.div`
  width: 100%;
  height: 220px;
  border: 2px dashed #444;
  border-radius: 12px;
  color: #aaa;
  display: flex;
  flex-direction: column;
  gap: 8px;
  justify-content: center;
  align-items: center;
  margin-bottom: 15px;
  cursor: pointer;
`;

const HiddenInput = styled.input`
  display: none;
`;

const UploadLabel = styled.label`
  cursor: pointer;
  color: #ddd;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 6px;

  span {
    font-size: 14px;
  }

  &:hover {
    opacity: 0.8;
  }
`;

const ButtonsRow = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 10px;
`;

const CancelButton = styled.button`
  background: none;
  border: 1px solid #555;
  color: #ccc;
  padding: 6px 14px;
  border-radius: 6px;
  cursor: pointer;

  &:hover {
    background: rgba(255, 255, 255, 0.05);
  }
`;

const SaveButton = styled.button<{ disabled?: boolean }>`
  background: ${(p) => (p.disabled ? "#334155" : "#1d9bf0")};
  border: none;
  color: white;
  padding: 6px 18px;
  border-radius: 6px;
  cursor: ${(p) => (p.disabled ? "not-allowed" : "pointer")};
  font-weight: 600;
`;

const ModalOverlay = styled.div`
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.55);
  display: flex;
  justify-content: center;
  align-items: center;
  backdrop-filter: blur(2px);
`;

const Modal = styled.div`
  background: #0f172a;
  padding: 22px;
  width: 90%;
  max-width: 420px;
  border-radius: 14px;
  animation: scaleFade 0.25s ease;
  svg {
    transition: transform 0.2s ease;
  }

  &:hover svg {
    transform: scale(1.1);
  }
  @keyframes scaleFade {
    from {
      transform: scale(0.9);
      opacity: 0;
    }
    to {
      transform: scale(1);
      opacity: 1;
    }
  }
`;

const ModalTitle = styled.h2`
  color: white;
  margin-bottom: 16px;
  font-size: 20px;
  font-weight: 600;
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

const Username = styled.span`
  font-size: 14px;
`;

const Bio = styled.p<{ $useTheme: string }>`
  margin-top: 20px;
  font-size: 15px;
  line-height: 1.4;
  color: ${({ $useTheme }) => $useTheme === 'dark' ? '#9ba6b5b0' : '#444e5ce4'}
`;

const EditButton = styled.button<{ $useTheme: string }>`
  background: ${({ $useTheme }) => $useTheme === "dark" ? "#fff" : "#000"};
  color: ${({ $useTheme }) => $useTheme === "dark" ? "#000" : "#fff"};
  border: none;
  padding: 8px 14px;
  border-radius: 999px;
  cursor: pointer;
  font-weight: 600;
  font-size: 14px;
`;
