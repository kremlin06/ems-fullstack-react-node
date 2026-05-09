import { createContext } from 'react';


// this is a context object and not a component
export const ThemeContext = createContext(null);

// this is  a component. the problem is that if we export this component from the same file as the context, 
// React Fast Refresh will throw a warning about "non-component exports". By separating them into different 
// files, we can avoid this issue and ensure that Fast Refresh works correctly without any warnings.

/*
  when i change a line of code in this file, React isn't sure if the change affects the Logic or the UI. so this
  gives up the Fast Refresh and reloads the entire browser tab.

  the solution i guess is to remove and put ThemeProvider in a separate file, so the when I change the logic in ThemeProvider, 
  it won't affect the ThemeContext export, and Fast Refresh can still work without any warnings.

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

*/