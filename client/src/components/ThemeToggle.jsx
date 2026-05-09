import styled from 'styled-components';
import { useTheme } from '../hooks/useTheme';

const ToggleContainer = styled.button`
  width: 50px;
  height: 28px;
  border-radius: 14px;
  border: none;
  background: ${props => props.theme.colors.bgTertiary};
  cursor: pointer;
  display: flex;
  align-items: center;
  padding: 2px;
  transition: ${props => props.theme.transitions.default};
  position: relative;
  overflow: hidden;

  &:hover {
    background: ${props => props.theme.colors.bgHover};
  }
`;

const ToggleCircle = styled.div`
  width: 24px;
  height: 24px;
  border-radius: 50%;
  background: ${props => props.theme.colors.accentPrimary};
  position: absolute;
  left: ${props => (props.isLight ? '2px' : '24px')};
  transition: ${props => props.theme.transitions.fast};
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 14px;
`;

const ThemeToggle = () => {
  const { themeMode, toggleTheme } = useTheme();

  return (
    <ToggleContainer
      onClick={toggleTheme}
      title={`Switch to ${themeMode === 'light' ? 'dark' : 'light'} mode`}
      aria-label="Toggle theme"
    >
      <ToggleCircle isLight={themeMode === 'light'}>
        {themeMode === 'light' ? '☀️' : '🌙'}
      </ToggleCircle>
    </ToggleContainer>
  );
};

export default ThemeToggle;
