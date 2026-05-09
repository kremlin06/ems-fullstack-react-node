import { useState, useEffect } from 'react';
import { ThemeContext } from './ThemeContext';   
import { createTheme } from '../styles/theme';
 
export const ThemeProvider = ({ children }) => {
  const [themeMode, setThemeMode] = useState(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('themeMode') || 'dark';
    }
    return 'dark';
  });
 
  const theme = createTheme(themeMode);
 
  useEffect(() => {
    localStorage.setItem('themeMode', themeMode);
    document.documentElement.setAttribute('data-theme', themeMode);
  }, [themeMode]);
 
  const toggleTheme = () => {
    setThemeMode(prev => (prev === 'light' ? 'dark' : 'light'));
  };
 
  return (
    <ThemeContext.Provider value={{ themeMode, toggleTheme, theme }}>
      {children}
    </ThemeContext.Provider>
  );
};
 
export default ThemeProvider;