import { useEffect } from 'react';
import { silentRefresh } from '../../lib/auth.ts';

export const useTokenRefresh = () => {

  useEffect(() => {
    const interval = setInterval(() => {
      silentRefresh();
    }, 13 * 60 * 1000)

    const handleFocus = () => {
      silentRefresh().then((newToken) => {
        if(!newToken) {
          window.location.href = '/';
        }
      })
    }

  window.addEventListener('focus', handleFocus)

  return () => {
    clearInterval(interval);
    window.removeEventListener('focus', handleFocus);
  }
  }, [])
}