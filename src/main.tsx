import { createRoot } from 'react-dom/client'
import App from './App';
import { ThemeProvider } from '@/store/theme/ThemeContext';
import { Toaster } from "react-hot-toast";

createRoot(document.getElementById('root')!).render(
  <ThemeProvider>
    <App />
    <Toaster position='top-center'/>
  </ThemeProvider>
)
