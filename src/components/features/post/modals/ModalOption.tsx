import styled from 'styled-components';
import { useEffect, useRef } from 'react';
import { useMutation } from '@apollo/client/react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { useAuthStore, useTheme, usePostStore } from '@/store';
import { REMOVE_POST } from '@/graphql/mutation';
import { IoPersonCircleOutline, IoTrashOutline } from "react-icons/io5";
import { HiCheckCircle } from "react-icons/hi";
import type { PostQueryProps } from '../types';

type Props = {
  setIsOpenOption: (value: boolean) => void;
  post: PostQueryProps;
}

export const ModalOption = ({ setIsOpenOption, post }: Props) => {
  const ref = useRef<HTMLDivElement>(null);
  const user = useAuthStore((state) => state.user);
  const removePost = usePostStore((state) => state.removePost);
  const [remove_post] = useMutation(REMOVE_POST);
  const navigate = useNavigate();
  const { theme } = useTheme();
  const postId = post.clientId || post.id;

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setIsOpenOption(false);
      }
    }
    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, [setIsOpenOption])

  const handleClick = async (action: string) => {
    if(action === "delete") {
      removePost(postId);
      toast.success("Se eliminó con exito", {
        icon: <HiCheckCircle size={16} color="#3676c0ff" />,
        duration: 2000,
        style: {
          background: '#dbe7f0ff',
          color: '#000',
          border: '1px solid #719bccff'
        }
      })
      await remove_post({ variables: { postId: postId }})
    } else {
      navigate(`/profile/${post.user_id.id}`, { state: { data: {
        id: post.user_id.id,
        name: post.user_id.name,
        email: post.user_id.email,
        avatar: post.user_id.avatar,
        bio: post.user_id.bio,
        coverphoto: post.user_id.coverphoto
      } }});
    }
  }

  return (
    <Container ref={ref} $theme={theme}>
      {post.user_id.id === user?.id ? (
        <Option onClick={() => handleClick("delete")} $theme={theme}>
          <Icon><IoTrashOutline size={20} /></Icon>
          <Label>delete</Label>
        </Option>
      ) : (
        <Option onClick={() => handleClick("profile")} $theme={theme}>
          <Icon><IoPersonCircleOutline size={20} /></Icon>
          <Label>to profile</Label>
        </Option>
      )}
    </Container>
  )
}

const Container = styled.div<{ $theme: string }>`
  display: flex;
  width: 140px;
  right: 0;
  height: auto;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  position: absolute;
  z-index: 999;
  background: ${({ $theme }) => 
    $theme === 'dark'
      ? 'rgba(59, 83, 108, 1)'
      : '#151414ff'};
  border-radius: 12px;
  padding: 4px 0;
  transition: background 0.2s;
`;

const Option = styled.div<{ $theme: string }>`
  display: flex;
  align-items: center;
  color: ${({ $theme }) => $theme === 'dark'? '#bab8b8ff' : '#adababff'};
  cursor: pointer;
  padding: 6px;
  border-radius: 8px;
  gap: 6px;
  font-size: 15px;
  transition: background 0.2s, color 0.2s;
  &:hover {
    color: ${({ $theme }) => $theme === 'dark'? '#fff' : '#fff'};
  }
`;

const Icon = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
`;

const Label = styled.span`
  font-weight: 500;
  font-size: 15px;
`;
