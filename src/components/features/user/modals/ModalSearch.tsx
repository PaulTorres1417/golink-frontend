import { useEffect, useRef, useState } from 'react';
import styled from 'styled-components';
import { useLazyQuery } from '@apollo/client/react';
import { gql } from '@apollo/client';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '@/store/theme';
import { Spinner, Avatar } from '@/components/ui';

type ModalProps = {
  setIsOpenModalSearch: (value: boolean) => void;
  setSearchValue: (value: string) => void;
  searchValue: string;
}

const SEARCH_USER_QUERY = gql`
  query Search_User($query: String!) {
    searchUser(query: $query) {
      id
      name
      email
      avatar
      coverphoto
      bio
    }
  }
`;

type User = {
  id: string;
  name: string;
  email: string;
  avatar?: string | null;
  coverphoto?: string | null;
  bio?: string | null;
}
type SearchUserProps = {
  searchUser: User[];
}

export const ModalSearch = ({ 
  setIsOpenModalSearch, searchValue, setSearchValue }: ModalProps) => {
  const ref = useRef<HTMLDivElement>(null);
  const [searchUsers, { data, loading }] = useLazyQuery<SearchUserProps>(SEARCH_USER_QUERY);
  const [debouncedValue, setDebouncedValue] = useState<string>(searchValue);
  const navigate = useNavigate();
  const { theme } = useTheme();

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedValue(searchValue);
    }, 300);
    return () => clearTimeout(timer);
  }, [searchValue]);

  useEffect(() => {
    if (debouncedValue.trim().length > 1) {
      searchUsers({ variables: { query: debouncedValue } });
    }
  }, [debouncedValue]);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setIsOpenModalSearch(false);
      }
    };
    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, [setIsOpenModalSearch]);

  const handleClick = (user: User ) => {
    setIsOpenModalSearch(false);
    setSearchValue('');
    navigate(`/profile/${user.id}`, { state: { data: user }});
  }

  const renderContent = () => {
    if (searchValue.trim().length === 0) {
      return (
        <EmptyState>
          <EmptyText>Try searching for people, lists, or keywords</EmptyText>
        </EmptyState>
      );
    }

    if (loading) {
      return (
        <EmptyState>
          <EmptyText><Spinner /></EmptyText>
        </EmptyState>
      );
    }

    if (!data || data.searchUser.length === 0) {
      return (
        <EmptyState>
          <EmptyText>No results for "{searchValue}"</EmptyText>
        </EmptyState>
      );
    }

    return data.searchUser.map((user) => (
      <SearchItem key={user.id} $themeColor={theme} onClick={() => handleClick(user)}>
        <Initials>
          <Avatar avatarUrl={user.avatar} />
        </Initials>
        <SearchContent>
          <strong>{user.name}</strong>
          <Sub>@{user.email.split('@')[0]}</Sub>
        </SearchContent>
      </SearchItem>
    ));
  };

  return (
    <Container ref={ref} $themeColor={theme} onClick={(e) => e.stopPropagation()}>
      <SearchList>
        {renderContent()}
      </SearchList>
    </Container>
  );
};

const Container = styled.div<{ $themeColor: string }>`
  position: absolute;
  width: 100%;
  max-height: 500px;
  left: 0;
  top: 105%;
  z-index: 999;
  border-radius: 12px;
  background: ${({ $themeColor }) => $themeColor === 'dark' ? '#2d394cff' : '#ffffff'};
  color: ${({ $themeColor }) => $themeColor === 'dark' ? '#fff' : '#000'};
  box-shadow:
    0 2px 8px rgba(0, 0, 0, 0.15),
    0 8px 24px rgba(0, 0, 0, 0.18),
    0 0 0 1px rgba(0, 0, 0, 0.08);
  display: flex;
  flex-direction: column;
  overflow: hidden;
`;

const SearchList = styled.ul`
  list-style: none;
  margin: 0;
  padding: 0;
`;

const SearchItem = styled.li<{ $themeColor: string }>`
  display: flex;
  align-items: center;
  padding: 10px 16px;
  cursor: pointer;
  gap: 12px;
  transition: background 0.2s;
  border-bottom: 1px solid rgba(0,0,0,0.04);

  &:hover {
    background: rgba(0, 0, 0, 0.08);
  }
`;

const Initials = styled.div`
  width: 36px;
  height: 36px;
  border-radius: 50%;
  overflow: hidden;
`;

const SearchContent = styled.div`
  display: flex;
  flex-direction: column;
  font-size: 14px;
`;

const Sub = styled.span`
  font-size: 12px;
  color: #888;
  margin-top: 2px;
`;

const EmptyState = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 40px 20px;
  gap: 10px;
`;

const EmptyText = styled.div`
  font-size: 15px;
  color: #888;
  text-align: center;
  line-height: 1.5;
  margin: 0;
`;