import styled from "styled-components";
import { MdBookmark, MdBookmarkBorder } from 'react-icons/md'
import { useTheme } from "@/store/theme";

type SavedButtonProps = {
  isSaved: boolean;
  toggleSaved: () => void
}
export const SavedButton = ({ isSaved, toggleSaved }: SavedButtonProps) => {
  const { theme } = useTheme();

  const handleSavePost = () => toggleSaved();

  return (
    <Action
      className="saved"
      $themeMode={theme}
      $isSaved={isSaved}
      onClick={handleSavePost}
    >
      <Inner>
        {
          isSaved
            ? <MdBookmark size={24} />
            : <MdBookmarkBorder size={24} />
        }
      </Inner>
    </Action>
  )
}

const Inner = styled.div`
  display: flex;
  align-items: center;
  gap: 6px;
  border-radius: 20px;
  transition: background-color 0.18s ease, color 0.18s ease;

  svg { font-size: 24px }
  span { font-size: 15px }
`;

const Action = styled.div<{ $themeMode: string, $isSaved: boolean }>`
  display: flex;
  justify-content: space-between;
  cursor: pointer;
  color: ${({ $themeMode, $isSaved }) =>
    $isSaved
      ? '#1d9bf0'
      : ($themeMode === 'dark'
        ? 'rgba(113, 118, 123, 1)'
        : 'rgba(83, 100, 113, 1)')};

  &.saved:hover ${Inner} {
    color: #1d9bf0;
  }
`;

