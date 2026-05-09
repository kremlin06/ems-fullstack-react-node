import { createGlobalStyle } from 'styled-components';

export const GlobalStyle = createGlobalStyle`
   *, *::before, *::after {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
   }

   html {
      scroll-behavior: smooth;
      -webkit-font-smoothing: antialiased;
      -moz-osx-font-smoothing: grayscale;
      text-rendering: optimizeLegibility;
   }

   body {
      font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'SF Pro Display', 'Segoe UI', Roboto, sans-serif;
      background-color: ${props => props.theme.colors.bgPrimary};
      color: ${props => props.theme.colors.textPrimary};
      line-height: ${props => props.theme.lineHeights.normal};
      overflow-x: hidden;
      font-size: ${props => props.theme.fontSizes.body};
      font-weight: ${props => props.theme.fontWeights.regular};
      letter-spacing: -0.01em;
   }

   h1, h2, h3, h4, h5, h6 {
      font-family: inherit;
      font-weight: ${props => props.theme.fontWeights.semibold};
      letter-spacing: -0.02em;
      line-height: ${props => props.theme.lineHeights.tight};
   }

   a { text-decoration: none; color: inherit; }
   button { font-family: inherit; border: none; outline: none; cursor: pointer; }
   input, textarea, select { font-family: inherit; outline: none; }

   ::-webkit-scrollbar { width: 8px; height: 8px; }
   ::-webkit-scrollbar-track { background: ${props => props.theme.colors.bgPrimary}; }
   ::-webkit-scrollbar-thumb {
      background: ${props => props.theme.colors.borderColor};
      border-radius: 4px;
      &:hover { background: ${props => props.theme.colors.borderDark}; }
   }

   ::selection { background: ${props => props.theme.colors.accentPrimary}; color: #ffffff; }

   :focus-visible {
      outline: 2px solid ${props => props.theme.colors.accentPrimary};
      outline-offset: 2px;
   }

   @keyframes fadeInUp {
      from { opacity: 0; transform: translateY(30px); }
      to { opacity: 1; transform: translateY(0); }
   }

   @keyframes slideIn {
      from { opacity: 0; transform: translateX(-20px); }
      to { opacity: 1; transform: translateX(0); }
   }

   body, div, section, article, aside, nav, header, footer, main {
      transition: background-color 0.3s ease, color 0.3s ease, border-color 0.3s ease;
   }
`;