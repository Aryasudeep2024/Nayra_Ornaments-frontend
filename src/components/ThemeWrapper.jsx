// components/ThemeWrapper.jsx
import React from 'react';
import { useTheme } from '../context/ThemeContext';

const ThemeWrapper = ({ children }) => {
  const { theme } = useTheme();

  return (
    <div className={theme === 'dark' ? 'bg-dark text-light' : 'bg-light text-dark'} style={{ minHeight: '100vh' }}>
      {children}
    </div>
  );
};

export default ThemeWrapper;
