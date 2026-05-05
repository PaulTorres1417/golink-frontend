import { describe, expect, it, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { ThemeProvider } from '@/store/theme/ThemeContext';
import ProfileGlobal  from './ProfileGlobal';

vi.mock('./UserInformation', () => ({
  UserInformation: ({ id }: { id?: string }) => <div>UserInformation {id}</div>,
}));

interface ProfileRouteState {
  data?: {
    name: string;
    email: string;
    avatar?: string;
    coverphoto?: string;
  };
}

function renderProfile({
  route = '/profile/123',
  state,
}: {
  route?: string;
  state?: ProfileRouteState;
}) {
  return render(
    <ThemeProvider>
      <MemoryRouter initialEntries={[{ pathname: route, state }]}>
        <Routes>
          <Route path="/profile/:id" element={<ProfileGlobal />} />
        </Routes>
      </MemoryRouter>
    </ThemeProvider>
  );
}

describe('ProfileGlobal', () => {
  it('renders fallback when route state has no data', () => {
    renderProfile({ state: undefined });
    expect(screen.getByText('No profile data')).toBeInTheDocument();
  });

  it('renders name/email and avatar fallback when avatar missing', () => {
    renderProfile({
      state: {
        data: {
          name: 'Paul',
          email: 'paul@example.com',
          avatar: '',
          coverphoto: '',
        },
      },
    });

    expect(screen.getByText('Paul')).toBeInTheDocument();
    expect(screen.getByText('paul@example.com')).toBeInTheDocument();
    expect(screen.getByText('UserInformation 123')).toBeInTheDocument();
    expect(screen.queryByAltText('Avatar')).not.toBeInTheDocument();
  });
});

