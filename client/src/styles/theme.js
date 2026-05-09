export const lightTheme = {
   colors: {
      bgPrimary: '#f5f5f7',
      bgSecondary: '#ffffff',
      bgTertiary: '#f0f0f2',
      bgHover: '#e8e8ed',
      bgActive: '#d1d1d6',
      
      textPrimary: '#1d1d1f',
      textSecondary: '#6e6e73',
      textTertiary: '#86868b',
      textDisabled: '#a1a1a6',
      textLink: '#0066cc',
      
      accentPrimary: '#0071e3',
      accentSecondary: '#0077ed',
      accentHover: '#005bb5',
      
      accentOrange: '#ff9900',
      accentOrangeHover: '#e68a00',
      accentWarm: '#ffa726',
      
      success: '#34c759',
      successBg: '#e8f5e9',
      warning: '#ff9500',
      warningBg: '#fff3e0',
      error: '#ff3b30',
      errorBg: '#ffebee',
      info: '#0071e3',
      infoBg: '#e3f2fd',
      
      borderColor: '#e5e5ea',
      borderDark: '#d2d2d7',
      borderLight: '#f0f0f2',
      
      shadowSm: '0 1px 3px rgba(0, 0, 0, 0.08)',
      shadowMd: '0 4px 12px rgba(0, 0, 0, 0.08)',
      shadowLg: '0 8px 24px rgba(0, 0, 0, 0.12)',
      shadowXl: '0 12px 40px rgba(0, 0, 0, 0.16)',
      
      cardBg: '#ffffff',
      cardHover: '#fafafa',
      
      inputBg: '#ffffff',
      inputBorder: '#d2d2d7',
      inputFocus: '#0071e3',
      
      badgeBg: '#f5f5f7',
      badgeText: '#1d1d1f',
      
      starColor: '#ffb400',
      starEmpty: '#e5e5ea',
      
      navBg: '#ffffff',
      navBorder: '#e5e5ea',
      navActive: '#1d1d1f',
   },
   
   gradients: {
      heroGradient: 'linear-gradient(135deg, #f5f7fa 0%, #e4e8ec 100%)',
      cardGradient: 'linear-gradient(145deg, #ffffff 0%, #f8f9fa 100%)',
      accentGradient: 'linear-gradient(135deg, #0071e3 0%, #00c6ff 100%)',
      orangeGradient: 'linear-gradient(135deg, #ff9900 0%, #ff6600 100%)',
      warmGradient: 'linear-gradient(135deg, #fff5eb 0%, #ffe0cc 100%)',
      subtleGradient: 'linear-gradient(180deg, #f5f5f7 0%, #ffffff 100%)',
   },
};

export const darkTheme = {
   colors: {
      bgPrimary: '#0a0a0a',
      bgSecondary: '#111111',
      bgTertiary: '#1a1a1a',
      bgHover: '#222222',
      bgActive: '#2a2a2a',
      
      textPrimary: '#ffffff',
      textSecondary: '#a1a1aa',
      textTertiary: '#71717a',
      textDisabled: '#52525b',
      textLink: '#60a5fa',
      
      accentPrimary: '#3b82f6',
      accentSecondary: '#2563eb',
      accentHover: '#60a5fa',
      
      accentOrange: '#f59e0b',
      accentOrangeHover: '#d97706',
      accentWarm: '#fb923c',
      
      success: '#22c55e',
      successBg: '#052e16',
      warning: '#eab308',
      warningBg: '#422006',
      error: '#ef4444',
      errorBg: '#450a0a',
      info: '#3b82f6',
      infoBg: '#172554',
      
      borderColor: '#27272a',
      borderDark: '#3f3f46',
      borderLight: '#18181b',
      
      shadowSm: '0 1px 3px rgba(0, 0, 0, 0.3)',
      shadowMd: '0 4px 12px rgba(0, 0, 0, 0.4)',
      shadowLg: '0 8px 24px rgba(0, 0, 0, 0.5)',
      shadowXl: '0 12px 40px rgba(0, 0, 0, 0.6)',
      
      cardBg: '#111111',
      cardHover: '#1a1a1a',
      
      inputBg: '#1a1a1a',
      inputBorder: '#27272a',
      inputFocus: '#3b82f6',
      
      badgeBg: '#1a1a1a',
      badgeText: '#ffffff',
      
      starColor: '#f59e0b',
      starEmpty: '#27272a',
      
      navBg: '#0a0a0a',
      navBorder: '#27272a',
      navActive: '#ffffff',
   },
   
   gradients: {
      blueGradient: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      textGradient: 'linear-gradient(135deg, #fff 0%, #a1a1aa 100%)',
      mockupGradient: 'linear-gradient(135deg, #1e3a8a 0%, #3b82f6 50%, #60a5fa 100%)',
      heroGradient: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)',
      cardGradient: 'linear-gradient(145deg, #111111 0%, #1a1a1a 100%)',
      accentGradient: 'linear-gradient(135deg, #3b82f6 0%, #60a5fa 100%)',
      orangeGradient: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
      warmGradient: 'linear-gradient(135deg, #1a1208 0%, #2d1f0e 100%)',
      subtleGradient: 'linear-gradient(180deg, #0a0a0a 0%, #111111 100%)',
   },
};

// Shared theme properties
export const sharedTheme = {
   spacing: {
      xs: '0.5rem',
      sm: '0.625rem',
      md: '1rem',
      lg: '1.5rem',
      xl: '2rem',
      xxl: '4rem',
   },
   transitions: {
      default: 'all 0.3s ease',
      fast: 'all 0.15s ease',
      slow: 'all 0.5s ease',
   },
   fonts: {
      primary: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', 'SF Pro Display', Roboto, sans-serif",
      secondary: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
      mono: "'SF Mono', 'Fira Code', 'Fira Mono', monospace",
   },
   fontSizes: {
      h1: '3.5rem',
      h2: '2.5rem',
      h3: '1.75rem',
      h4: '1.25rem',
      h5: '1.125rem',
      h6: '1rem',
      body: '1rem',
      bodyMd: '0.95rem',
      bodySm: '0.875rem',
      bodyXs: '0.75rem',
   },
   fontWeights: {
      light: 300,
      regular: 400,
      medium: 500,
      semibold: 600,
      bold: 700,
   },
   lineHeights: {
      tight: 1.1,
      normal: 1.6,
      relaxed: 1.7,
   },
   borderRadius: {
      sm: '6px',
      md: '8px',
      lg: '12px',
      xl: '16px',
      full: '9999px',
   },
   breakpoints: {
      sm: '640px',
      md: '768px',
      lg: '1024px',
      xl: '1280px',
      xxl: '1536px',
   },
};

// Create theme by merging colors + shared properties
export const createTheme = (mode = 'dark') => {
   const colors = mode === 'light' ? lightTheme.colors : darkTheme.colors;
   const gradients = mode === 'light' ? lightTheme.gradients : darkTheme.gradients;
   
   return {
      colors,
      gradients,
      ...sharedTheme,
      mode,
   };
};

export default createTheme('dark');


// export const theme = {
//    colors: {
//       bgPrimary: '#0a0a0a',
//       bgSecondary: '#111111',
//       bgTertiary: '#1a1a1a',
//       textPrimary: '#ffffff',
//       textSecondary: '#a1a1aa',
//       textTertiary: '#71717a',
//       accentPrimary: '#3b82f6',
//       accentSecondary: '#2563eb',
//       borderColor: '#27272a',
//       success: '#22c55e',
//    },
//    gradients: {
//       blueGradient: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
//       textGradient: 'linear-gradient(135deg, #fff 0%, #a1a1aa 100%)',
//       mockupGradient: 'linear-gradient(135deg, #1e3a8a 0%, #3b82f6 50%, #60a5fa 100%)',
//    },
//    spacing: {
//       xs: '0.5rem',
//       sm: '0.625rem',
//       md: '1rem',
//       lg: '1.5rem',
//       xl: '2rem',
//       xxl: '4rem',
//    },
//    transitions: {
//       default: 'all 0.3s ease',
//    },
//    fonts: {
//       primary: "'Segoe UI', 'Inter', 'SF Pro Display', -apple-system, BlinkMacSystemFont, Roboto, sans-serif",
//       secondary: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
//    },
//    fontSizes: {
//       h1: '3.5rem',
//       h2: '2.5rem',
//       h3: '1.75rem',
//       h4: '1.25rem',
//       h5: '1.125rem',
//       h6: '1rem',
//       body: '1rem',
//       bodyMd: '0.95rem',
//       bodySm: '0.875rem',
//       bodyXs: '0.75rem',
//    },
//    fontWeights: {
//       light: 300,
//       regular: 400,
//       medium: 500,
//       semibold: 600,
//       bold: 700,
//    },
//    lineHeights: {
//       tight: 1.1,
//       normal: 1.6,
//       relaxed: 1.7,
//    },
// };

// export default theme;