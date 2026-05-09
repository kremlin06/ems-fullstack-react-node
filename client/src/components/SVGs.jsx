const CheckmarkSVG = () => (
   <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <polyline points="20 6 9 17 4 12"></polyline>
   </svg>
);

const LogoSVG = () => (
   <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
   <circle cx="16" cy="16" r="14" stroke="white" strokeWidth="2" />
      <path
         d="M16 8L18 14L24 16L18 18L16 24L14 18L8 16L14 14L16 8Z"
         fill="white"
      />
   </svg>
);

const MoonSVG = () => (
   <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
   </svg>
);

export { CheckmarkSVG, LogoSVG, MoonSVG };