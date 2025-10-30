import { useEffect } from 'react';

export const useMessageAutoClose = (message, setMessage) => {
  useEffect(() => {
    if (message.text) {
      const timer = setTimeout(() => {
        setMessage({ text: '', type: '' });
      }, 5000);

      return () => clearTimeout(timer);
    }
  }, [message.text]);
};