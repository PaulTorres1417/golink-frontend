import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';

vi.mock('@/store/theme', () => ({
  useTheme: () => ({ theme: 'dark' }),
}));

import { Actions } from './Actions';

describe('PostForm Actions (footer)', () => {
  it('disables publish button when text is empty', () => {
    render(
      <Actions
        text=""
        setFile={vi.fn()}
        fileInputRef={{ current: document.createElement('input') }}
        handleCreatePost={vi.fn()}
      />
    );

    expect(screen.getByRole('button', { name: 'Post' })).toBeDisabled();
  });

  it('renders Repost label when data provided', () => {
    render(
      <Actions
        text="hi"
        setFile={vi.fn()}
        fileInputRef={{ current: document.createElement('input') }}
        handleCreatePost={vi.fn()}
        data="repost"
      />
    );

    expect(screen.getByRole('button', { name: 'Repost' })).toBeInTheDocument();
  });

  it('clicking file action triggers input.click()', async () => {
    const clickSpy = vi.spyOn(HTMLInputElement.prototype, 'click');

    render(
      <Actions
        text="hello"
        setFile={vi.fn()}
        fileInputRef={{ current: null }}
        handleCreatePost={vi.fn()}
      />
    );

    await userEvent.click(screen.getByTestId('postform-action-file'));

    expect(clickSpy).toHaveBeenCalled();
  });
});

