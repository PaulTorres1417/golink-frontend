import { useContext } from 'react';
import { ThemeContext } from './ThemeContext.context';

export const useTheme = () => useContext(ThemeContext);