import { ThemeProvider as StyledThemeProvider } from 'styled-components';
import { GlobalStyle } from './styles/Global.styles';
import ThemeProvider from './contexts/ThemeProvider'; // provider lives here
import { useTheme } from './hooks/useTheme';             // hook lives here
// import Layout from './components/Layout';
import Onboarding from './pages/Onboarding';
import Login from './pages/Login';

const AppContent = () => {
  const { theme } = useTheme();

  if (!theme) return <div style={{background: 'white', height: '100vh'}}>Loading Theme...</div>

  return (
    <StyledThemeProvider theme={theme}>
      <GlobalStyle />
        <Onboarding />
        <Login />
    </StyledThemeProvider>
  );
};

const App = () => {
  return (
    <ThemeProvider>
      <AppContent />
    </ThemeProvider>
  );
};

export default App;