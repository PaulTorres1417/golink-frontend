import { useEffect, useState } from "react";
import styled, { keyframes } from "styled-components";
import { gql } from "@apollo/client";
import { useMutation } from "@apollo/client/react";
import { useAuthStore } from "@/store/auth";

const UPDATE_PROFILE = gql`
  mutation UpdateProfile($name: String, $bio: String){
    updateProfile(name: $name, bio: $bio){
      id
      name
      bio
    }
  }
`;

type ModalUserInformationProps = {
  isOpen: boolean;
  setOpenModel: (isOpen: boolean) => void;
}

type UpdatePropsVars = {
  name?: string;
  bio?: string;
}
type UpdateProfileResponse = {
  updateProfile: {
    id: string;
    name?: string;
    bio?: string;
  }
}

export const ModalUserInformation = ({ isOpen, setOpenModel }: ModalUserInformationProps) => {
  const user = useAuthStore((state) => state.user);
  const setUser = useAuthStore((state) => state.setUser);

  const [name, setName] = useState("");
  const [bio, setBio] = useState("");
  const [UpdateProfile] = useMutation<UpdateProfileResponse, UpdatePropsVars>(UPDATE_PROFILE);

  if (!isOpen) return null;
  const hasChanges = name !== (user?.name ?? "") || bio !== (user?.bio ?? "");

  useEffect(() => {
    if (user) {
      setName(user.name ?? "");
      setBio(user.bio ?? "");
    }
  }, [user])

  const handleSubmit = async () => {
    try {
      const { data } = await UpdateProfile({ variables: { name, bio } });
      if (data?.updateProfile) {
        setUser({
          ...user,
          name: data.updateProfile.name ?? user?.name ?? "",
          bio: data.updateProfile.bio ?? user?.bio ?? "",
        });
        setOpenModel(!isOpen);
      }
    } catch (error) {
      console.error("Error updating profile:", error);
    }
  }

  return (
    <Overlay>
      <Modal>
        <Title>Editar perfil</Title>
        <Body>
          <Label>Nombre</Label>
          <Input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Tu nombre"
          />

          <Label>Biografia</Label>
          <Textarea
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            placeholder="Escribe una breve descripción..."
            rows={4}
          />

          <ButtonContainer>
            <CancelButton onClick={() => setOpenModel(!isOpen)}>Cancelar</CancelButton>
            <SaveButton disabled={!hasChanges} onClick={handleSubmit}>Guardar</SaveButton>
          </ButtonContainer>
        </Body>
      </Modal>
    </Overlay>
  );
};

const fadeIn = keyframes`
  from { opacity: 0; }
  to { opacity: 1; }
`;

const slideUp = keyframes`
  from { transform: translateY(16px) scale(0.98); opacity: 0; }
  to { transform: translateY(0) scale(1); opacity: 1; }
`;

const Overlay = styled.div`
  position: fixed;
  inset: 0;
  background: rgba(59, 83, 108, 0.41);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  animation: ${fadeIn} 0.15s ease;
`;

const Modal = styled.div`
  background: #000;
  border-radius: 16px;
  width: 560px;
  max-width: 95vw;
  max-height: 90vh;
  overflow-y: auto;
  animation: ${slideUp} 0.3s ease;
`;

const Title = styled.h2`
  font-size: 20px;
  font-weight: 700;
  color: #fff;
  padding: 16px 16px 12px;
  border-bottom: 1px solid rgba(125, 123, 123, 0.6);
  position: sticky;
  top: 0;
  background: #000;
  z-index: 1;
`;

const Body = styled.div`
  padding: 16px;
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

const Label = styled.label`
  display: block;
  margin-bottom: 6px;
  font-size: 13px;
  color: rgba(113, 118, 123, 1);
  font-weight: 500;
`;

const Input = styled.input`
  width: 100%;
  padding: 12px;
  background: transparent;
  border: 1px solid rgba(125, 123, 123, 0.6);
  border-radius: 4px;
  color: #fff;
  font-size: 15px;
  outline: none;
  transition: border-color 0.2s;

  &:focus {
    border-color: #1DA1F2;
  }

  &::placeholder {
    color: rgba(113, 118, 123, 1);
  }
`;

const Textarea = styled.textarea`
  width: 100%;
  padding: 12px;
  background: transparent;
  border: 1px solid rgba(125, 123, 123, 0.6);
  border-radius: 4px;
  color: #fff;
  font-size: 15px;
  outline: none;
  resize: none;
  transition: border-color 0.2s;

  &:focus {
    border-color: #1DA1F2;
  }

  &::placeholder {
    color: rgba(113, 118, 123, 1);
  }
`;

const ButtonContainer = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 10px;
  margin-top: 8px;
`;

const CancelButton = styled.button`
  background: transparent;
  border: 1px solid rgba(125, 123, 123, 0.6);
  color: #fff;
  padding: 8px 18px;
  border-radius: 999px;
  cursor: pointer;
  font-size: 14px;
  font-weight: 600;
  transition: background 0.15s;

  &:hover {
    background: rgba(255, 255, 255, 0.1);
  }
`;

const SaveButton = styled.button`
  background: #1d9bf0;
  color: #fff;
  border: none;
  padding: 8px 18px;
  border-radius: 999px;
  cursor: pointer;
  font-size: 14px;
  font-weight: 700;
  transition: background 0.15s;

  &:hover {
    background: #1DA1F2;
  }
    &:disabled {
    background: #afb1b28a;
    cursor: not-allowed;
  }
`;